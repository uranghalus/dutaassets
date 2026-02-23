"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";
import { withContext } from "@/lib/action-utils";
import { assetMaintenanceSchema } from "@/schema/asset-maintenance-schema";
import { serializePrisma } from "@/lib/utils";

export async function getAssetMaintenances({
  page = 1,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error("No active organization");

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: any = {
    organizationId,
    OR: search
      ? [
          {
            asset: {
              nama_asset: { contains: search },
            },
          },
          {
            provider: { contains: search },
          },
          {
            description: { contains: search },
          },
        ]
      : undefined,
  };

  const [data, total] = await Promise.all([
    prisma.assetMaintenance.findMany({
      where,
      include: {
        asset: {
          select: {
            nama_asset: true,
            kode_asset: true,
          },
        },
      },
      skip,
      take,
      orderBy: { maintenanceDate: "desc" },
    }),
    prisma.assetMaintenance.count({ where }),
  ]);

  return {
    data: serializePrisma(data),
    total,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createAssetMaintenance(formData: FormData | any) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    // Handle both FormData and plain objects
    const data =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    // Convert date string if it comes from form
    if (typeof data.maintenanceDate === "string") {
      data.maintenanceDate = new Date(data.maintenanceDate);
    }

    const validatedFields = assetMaintenanceSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const val = validatedFields.data;

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create Maintenance Record
        const maintenance = await tx.assetMaintenance.create({
          data: {
            organizationId,
            assetId: val.assetId,
            maintenanceDate: val.maintenanceDate,
            type: val.type,
            provider: val.provider,
            cost: val.cost,
            description: val.description,
            status: val.status,
          },
        });

        // 2. If it's a REPAIR and is currently ACTIVE (scheduled or just started),
        // update asset status to MAINTENANCE
        if (val.type === "REPAIR" && val.status === "SCHEDULED") {
          await tx.asset.update({
            where: { id_barang: val.assetId },
            data: { status: "MAINTENANCE" },
          });
        }

        return maintenance;
      });

      revalidatePath("/assets/maintenances");
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Failed to create maintenance:", error);
      return { error: error.message || "Failed to create maintenance" };
    }
  });
}

export async function updateAssetMaintenance(id: string, formData: any) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    const validatedFields = assetMaintenanceSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const val = validatedFields.data;

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Update Record
        await tx.assetMaintenance.update({
          where: { id, organizationId },
          data: {
            maintenanceDate: val.maintenanceDate,
            type: val.type,
            provider: val.provider,
            cost: val.cost,
            description: val.description,
            status: val.status,
          },
        });

        // 2. If status is now COMPLETED, and it was a repair, check if we should reset asset status
        if (val.status === "COMPLETED") {
          // Peek if there are any other SCHEDULED repairs for this asset
          const otherPending = await tx.assetMaintenance.findFirst({
            where: {
              assetId: val.assetId,
              status: "SCHEDULED",
              type: "REPAIR",
              id: { not: id },
            },
          });

          if (!otherPending) {
            await tx.asset.update({
              where: { id_barang: val.assetId },
              data: { status: "AVAILABLE" }, // Reset to available? Or maybe keep current?
              // Logic choice: if fixed, it's available.
            });
          }
        }
      });

      revalidatePath("/assets/maintenances");
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update maintenance:", error);
      return { error: error.message || "Failed to update maintenance" };
    }
  });
}

export async function deleteAssetMaintenance(id: string) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    try {
      await prisma.assetMaintenance.delete({
        where: { id, organizationId },
      });

      revalidatePath("/assets/maintenances");
      return { success: true };
    } catch (error: any) {
      console.error("Failed to delete maintenance:", error);
      return { error: error.message || "Failed to delete maintenance" };
    }
  });
}
