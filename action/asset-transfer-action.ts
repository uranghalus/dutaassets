"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { revalidatePath } from "next/cache";
import { assetTransferSchema } from "@/schema/asset-transfer-schema";

export type AssetTransferArgs = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
};

export async function getPaginatedAssetTransfers({
  page = 1,
  pageSize = 10,
  search,
  status,
}: AssetTransferArgs) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  const where: any = {
    organizationId,
  };

  if (search) {
    where.asset = {
      name: { contains: search },
    };
  }

  if (status) {
    where.status = status;
  }

  const [data, total] = await Promise.all([
    prisma.assetTransfer.findMany({
      where,
      skip,
      take: safePageSize,
      orderBy: { createdAt: "desc" },
      include: {
        asset: true,
        fromLocation: true,
        toLocation: true,
        fromEmployee: true,
        toEmployee: true,
      },
    }),
    prisma.assetTransfer.count({ where }),
  ]);

  return {
    data,
    total,
    pageCount: Math.ceil(total / safePageSize),
    page: safePage,
    pageSize: safePageSize,
  };
}

import { withContext } from "@/lib/action-utils";

export async function createAssetTransfer(data: any) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();
    const validated = assetTransferSchema.parse(data);

    // Filter out "none" values from Select components
    const cleanData = {
      ...validated,
      fromLocationId: validated.fromLocationId === "none" ? null : validated.fromLocationId,
      toLocationId: validated.toLocationId === "none" ? null : validated.toLocationId,
      fromEmployeeId: validated.fromEmployeeId === "none" ? null : validated.fromEmployeeId,
      toEmployeeId: validated.toEmployeeId === "none" ? null : validated.toEmployeeId,
    };

    const transfer = await prisma.assetTransfer.create({
      data: {
        ...cleanData,
        organizationId,
        status: "PENDING",
      },
    });

    revalidatePath("/asset-transfers");
    return { success: true, data: transfer };
  });
}

export async function approveAssetTransfer(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const transfer = await prisma.assetTransfer.update({
      where: { id, organizationId },
      data: { status: "APPROVED" },
    });

    revalidatePath("/asset-transfers");
    return { success: true, data: transfer };
  });
}

export async function completeAssetTransfer(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const result = await prisma.$transaction(async (tx) => {
      const transfer = await tx.assetTransfer.findUnique({
        where: { id, organizationId },
      });

      if (!transfer) throw new Error("Transfer not found");

      // Update transfer status
      const updatedTransfer = await tx.assetTransfer.update({
        where: { id },
        data: { status: "COMPLETED" },
      });

      // Update asset's current location/holder
      await tx.asset.update({
        where: { id_barang: transfer.assetId },
        data: {
          locationId: transfer.toLocationId || undefined,
          karyawan_id: transfer.toEmployeeId || undefined,
        },
      });

      return updatedTransfer;
    });

    revalidatePath("/asset-transfers");
    revalidatePath("/assets");
    return { success: true, data: result };
  });
}
