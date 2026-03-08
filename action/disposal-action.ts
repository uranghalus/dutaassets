"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { revalidatePath } from "next/cache";
import { initiateApproval } from "./workflow-action";

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

  // Start generic workflow
  await initiateApproval("ASSET_DISPOSAL", disposal.id);

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
