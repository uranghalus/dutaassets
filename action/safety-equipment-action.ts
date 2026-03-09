"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { withContext } from "@/lib/action-utils";

const safetyEquipmentFormSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  type: z.enum(["APAR", "HYDRANT"]),
  aparType: z.string().optional(),
  sizeKg: z.coerce.number().optional(),
  hydrantType: z.string().optional(),
  hydrantSize: z.string().optional(),
  qrCode: z.string().optional(),
});

export async function getSafetyEquipments({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    return { data: [], pageCount: 0 };
  }

  const [data, total] = await Promise.all([
    prisma.safetyEquipment.findMany({
      where: { organizationId },
      include: {
        asset: true,
        inspections: {
          select: { id: true },
        },
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.safetyEquipment.count({
      where: { organizationId },
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function getSafetyEquipmentsForSelect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    return { data: [] };
  }

  const data = await prisma.safetyEquipment.findMany({
    where: { organizationId },
    include: {
      asset: { select: { nama_asset: true, kode_asset: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { data };
}

export async function getAssetsForSafetySelect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    return { data: [] };
  }

  // Find assets that are not yet registered as safety equipment
  const data = await prisma.asset.findMany({
    where: {
      organization_id: organizationId,
      safetyEquipment: null, // Ensure asset isn't already a safety equipment
    },
    select: {
      id_barang: true,
      kode_asset: true,
      nama_asset: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { data };
}

export async function createSafetyEquipment(formData: FormData) {
  return withContext(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      throw new Error("No active organization");
    }

    const rawData = {
      assetId: formData.get("assetId"),
      type: formData.get("type"),
      aparType: formData.get("aparType") || undefined,
      sizeKg: formData.get("sizeKg") || undefined,
      hydrantType: formData.get("hydrantType") || undefined,
      hydrantSize: formData.get("hydrantSize") || undefined,
      qrCode: formData.get("qrCode") || undefined,
    };

    const validatedFields = safetyEquipmentFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { assetId, type, aparType, sizeKg, hydrantType, hydrantSize } =
      validatedFields.data;

    try {
      // Get the asset code to be used as QR Code
      const asset = await prisma.asset.findUnique({
        where: { id_barang: assetId },
        select: { kode_asset: true },
      });

      if (!asset) {
        throw new Error("Asset not found");
      }

      const generatedQrCode = asset.kode_asset;

      await prisma.safetyEquipment.create({
        data: {
          organizationId,
          assetId,
          type,
          aparType,
          sizeKg,
          hydrantType,
          hydrantSize,
          qrCode: generatedQrCode,
        },
      });

      revalidatePath("/safety/equipment");

      return { success: true };
    } catch (error) {
      console.error("Failed to create safety equipment:", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create safety equipment",
      };
    }
  });
}

export async function updateSafetyEquipment(id: string, formData: FormData) {
  return withContext(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      throw new Error("No active organization");
    }

    const rawData = {
      assetId: formData.get("assetId"),
      type: formData.get("type"),
      aparType: formData.get("aparType") || undefined,
      sizeKg: formData.get("sizeKg") || undefined,
      hydrantType: formData.get("hydrantType") || undefined,
      hydrantSize: formData.get("hydrantSize") || undefined,
      qrCode: formData.get("qrCode") || undefined,
    };

    const validatedFields = safetyEquipmentFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const {
      assetId,
      type,
      aparType,
      sizeKg,
      hydrantType,
      hydrantSize,
      qrCode,
    } = validatedFields.data;

    try {
      // Get the asset code to be used as QR Code
      const asset = await prisma.asset.findUnique({
        where: { id_barang: assetId },
        select: { kode_asset: true },
      });

      if (!asset) {
        throw new Error("Asset not found");
      }

      const generatedQrCode = asset.kode_asset;

      await prisma.safetyEquipment.update({
        where: { id },
        data: {
          assetId,
          type,
          aparType,
          sizeKg,
          hydrantType,
          hydrantSize,
          qrCode: generatedQrCode,
        },
      });

      revalidatePath("/safety/equipment");

      return { success: true };
    } catch (error) {
      console.error("Failed to update safety equipment:", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update safety equipment",
      };
    }
  });
}

export async function deleteSafetyEquipment(id: string) {
  return withContext(async () => {
    try {
      await prisma.safetyEquipment.delete({
        where: { id },
      });

      revalidatePath("/safety/equipment");

      return { success: true };
    } catch (error) {
      console.error("Failed to delete safety equipment:", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete safety equipment",
      };
    }
  });
}
