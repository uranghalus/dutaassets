"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { revalidatePath } from "next/cache";

export async function createDisposalRequest(data: {
  assetId: string;
  disposalMethod: string;
  disposalDate: Date;
  disposalValue?: number;
  reason?: string;
}) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const disposal = await prisma.assetDisposal.create({
    data: {
      organizationId,
      assetId: data.assetId,
      disposalMethod: data.disposalMethod,
      disposalDate: data.disposalDate,
      disposalValue: data.disposalValue,
      reason: data.reason,
      status: "PENDING_APPROVAL",
    },
  });

  revalidatePath(`/assets/${data.assetId}`);
  revalidatePath("/assets/disposals");

  return disposal;
}

export async function getPendingDisposals() {
  const { organizationId, role } = await getActiveOrganizationWithRole();

  if (!["owner", "admin", "manager"].includes(role)) {
    throw new Error("Unauthorized to view pending disposals");
  }

  return prisma.assetDisposal.findMany({
    where: { organizationId, status: "PENDING_APPROVAL" },
    include: {
      asset: {
        select: {
          nama_asset: true,
          kode_asset: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveDisposal(id: string) {
  const { organizationId, userId, role } =
    await getActiveOrganizationWithRole();

  if (!["owner", "admin", "manager"].includes(role)) {
    throw new Error("Unauthorized to approve disposals");
  }

  const disposal = await prisma.assetDisposal.update({
    where: { id, organizationId },
    data: {
      status: "APPROVED",
      approvedByUserId: userId,
    },
  });

  // Also update the asset status to DISPOSED
  await prisma.asset.update({
    where: { id_barang: disposal.assetId },
    data: { status: "DISPOSED" },
  });

  revalidatePath("/assets/disposals");
  revalidatePath(`/assets/${disposal.assetId}`);

  return disposal;
}

export async function rejectDisposal(id: string) {
  const { organizationId, userId, role } =
    await getActiveOrganizationWithRole();

  if (!["owner", "admin", "manager"].includes(role)) {
    throw new Error("Unauthorized to reject disposals");
  }

  const disposal = await prisma.assetDisposal.update({
    where: { id, organizationId },
    data: {
      status: "REJECTED",
      approvedByUserId: userId, // capturing who rejected it
    },
  });

  revalidatePath("/assets/disposals");
  revalidatePath(`/assets/${disposal.assetId}`);

  return disposal;
}
