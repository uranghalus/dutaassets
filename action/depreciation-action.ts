"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { revalidatePath } from "next/cache";

export async function calculateDepreciation(assetId: string) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const asset = await prisma.asset.findUnique({
    where: { id_barang: assetId, organization_id: organizationId },
    include: { item: true },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  if (
    !asset.item?.purchaseValue ||
    !asset.usefulLifeYears ||
    asset.usefulLifeYears <= 0
  ) {
    throw new Error(
      "Asset must have Purchase Value and valid Useful Life Years to calculate depreciation.",
    );
  }

  const purchaseValue = Number(asset.item?.purchaseValue);
  const salvageValue = Number(asset.salvageValue) || 0;
  const usefulLife = asset.usefulLifeYears;

  if (purchaseValue <= salvageValue) {
    throw new Error("Purchase Value must be greater than Salvage Value");
  }

  const depreciableBase = purchaseValue - salvageValue;
  const annualDepreciation = depreciableBase / usefulLife;

  // Generate schedule array
  const schedule = [];
  let currentBookValue = purchaseValue;
  let accumulatedDepreciation = 0;

  const purchaseDate = asset.tgl_pembelian
    ? new Date(asset.tgl_pembelian)
    : new Date();

  for (let year = 1; year <= usefulLife; year++) {
    accumulatedDepreciation += annualDepreciation;
    currentBookValue -= annualDepreciation;

    const periodDate = new Date(purchaseDate);
    periodDate.setFullYear(periodDate.getFullYear() + year);

    schedule.push({
      organizationId,
      assetId,
      periodDate,
      depreciationAmt: annualDepreciation,
      accumulatedDep: accumulatedDepreciation,
      netBookValue: currentBookValue,
    });
  }

  return schedule;
}

export async function saveDepreciationSchedule(
  assetId: string,
  schedule: any[],
) {
  const { organizationId, role } = await getActiveOrganizationWithRole();

  if (!["owner", "admin", "manager"].includes(role)) {
    throw new Error("Unauthorized to save depreciation schedules");
  }

  // Delete existing schedule if overriding
  await prisma.assetDepreciation.deleteMany({
    where: { assetId, organizationId },
  });

  // Bulk insert new schedule
  await prisma.assetDepreciation.createMany({
    data: schedule,
  });

  revalidatePath(`/assets/${assetId}`);
  return { success: true };
}

export async function getAssetDepreciationSchedule(assetId: string) {
  const { organizationId } = await getActiveOrganizationWithRole();

  return prisma.assetDepreciation.findMany({
    where: { assetId, organizationId },
    orderBy: { periodDate: "asc" },
  });
}
