"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { revalidatePath } from "next/cache";
import { assetTransferSchema } from "@/schema/asset-transfer-schema";
import { withContext } from "@/lib/action-utils";
import {
  requireAssetPermission,
  getDepartmentFilter,
  requireCrossDepartmentPermissionIfNeeded,
} from "@/lib/asset-guard";

export type AssetTransferArgs = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
};

// =============================================================================
// READ
// =============================================================================

export async function getPaginatedAssetTransfers({
  page = 1,
  pageSize = 10,
  search,
  status,
}: AssetTransferArgs) {
  const { organizationId, role, departmentId } =
    await getActiveOrganizationWithRole();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  // 🔐 Department scope for transfers:
  // Global roles see all transfers. Department roles only see transfers
  // that involve an asset belonging to their department.
  const deptFilter = getDepartmentFilter(role, departmentId);
  const assetFilter =
    Object.keys(deptFilter).length > 0
      ? { asset: { department_id: deptFilter.department_id } }
      : {};

  const where: any = {
    organizationId,
    ...assetFilter,
  };

  if (search) {
    where.asset = {
      ...where.asset,
      nama_asset: { contains: search },
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

// =============================================================================
// CREATE
// =============================================================================

export async function createAssetTransfer(data: any) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    // 🔐 Basic permission: can user create transfers at all?
    await requireAssetPermission({ "asset.transfer": ["create"] });

    const validated = assetTransferSchema.parse(data);

    const cleanData = {
      ...validated,
      fromLocationId:
        validated.fromLocationId === "none" ? null : validated.fromLocationId,
      toLocationId:
        validated.toLocationId === "none" ? null : validated.toLocationId,
      fromEmployeeId:
        validated.fromEmployeeId === "none" ? null : validated.fromEmployeeId,
      toEmployeeId:
        validated.toEmployeeId === "none" ? null : validated.toEmployeeId,
    };

    // 🔐 Cross-department check:
    // Resolve the departments of the source and destination employees to
    // determine if this is a cross-department transfer.
    let fromDeptId: string | null = null;
    let toDeptId: string | null = null;

    if (cleanData.fromEmployeeId) {
      const fromEmp = await prisma.karyawan.findUnique({
        where: { id_karyawan: cleanData.fromEmployeeId },
        select: { department_id: true },
      });
      fromDeptId = fromEmp?.department_id ?? null;
    }

    if (cleanData.toEmployeeId) {
      const toEmp = await prisma.karyawan.findUnique({
        where: { id_karyawan: cleanData.toEmployeeId },
        select: { department_id: true },
      });
      toDeptId = toEmp?.department_id ?? null;
    }

    // 🔐 If departments differ, require cross_department permission
    await requireCrossDepartmentPermissionIfNeeded(fromDeptId, toDeptId);

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

// =============================================================================
// APPROVE  (finance_manager / staff_asset only)
// =============================================================================

export async function approveAssetTransfer(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    // 🔐 Only finance_manager and staff_asset have this permission
    await requireAssetPermission({ "asset.transfer": ["approve"] });

    const transfer = await prisma.assetTransfer.update({
      where: { id, organizationId },
      data: { status: "APPROVED" },
    });

    revalidatePath("/asset-transfers");
    return { success: true, data: transfer };
  });
}

// =============================================================================
// COMPLETE
// =============================================================================

export async function completeAssetTransfer(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    // 🔐 Permission check
    await requireAssetPermission({ "asset.transfer": ["complete"] });

    const result = await prisma.$transaction(async (tx) => {
      const transfer = await tx.assetTransfer.findUnique({
        where: { id, organizationId },
      });

      if (!transfer) throw new Error("Transfer not found");

      const updatedTransfer = await tx.assetTransfer.update({
        where: { id },
        data: { status: "COMPLETED" },
      });

      // 🔄 Update asset's current location/holder after completion
      await tx.asset.update({
        where: { id_barang: transfer.assetId },
        data: {
          locationId: transfer.toLocationId || null,
          karyawan_id: transfer.toEmployeeId || null,
        },
      });

      return updatedTransfer;
    });

    revalidatePath("/asset-transfers");
    revalidatePath("/assets");
    return { success: true, data: result };
  });
}

// =============================================================================
// CANCEL
// =============================================================================

export async function cancelAssetTransfer(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    // 🔐 Permission check
    await requireAssetPermission({ "asset.transfer": ["cancel"] });

    const transfer = await prisma.assetTransfer.update({
      where: { id, organizationId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/asset-transfers");
    return { success: true, data: transfer };
  });
}
