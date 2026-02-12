"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";
import { withContext } from "@/lib/action-utils";
import { assetLocationSchema } from "@/schema/asset-location-schema";

export async function getAssetLocations({
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
            name: { contains: search },
          },
          {
            description: { contains: search },
          },
        ]
      : undefined,
  };

  const [data, total] = await Promise.all([
    prisma.assetLocation.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
    }),
    prisma.assetLocation.count({ where }),
  ]);

  return {
    data,
    total,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function getAllAssetLocations() {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");
  
    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");
  
    return prisma.assetLocation.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
}

export async function createAssetLocation(formData: any) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    const validatedFields = assetLocationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, description } = validatedFields.data;

    try {
      const result = await prisma.assetLocation.create({
        data: {
          organizationId,
          name,
          description,
        },
      });

      revalidatePath("/asset-locations");
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Failed to create location:", error);
      return { error: error.message || "Failed to create location" };
    }
  });
}

export async function updateAssetLocation(id: string, formData: any) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    const validatedFields = assetLocationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, description } = validatedFields.data;

    try {
      await prisma.assetLocation.update({
        where: { id, organizationId },
        data: {
          name,
          description,
        },
      });

      revalidatePath("/asset-locations");
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update location:", error);
      return { error: error.message || "Failed to update location" };
    }
  });
}

export async function deleteAssetLocation(id: string) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    try {
      await prisma.assetLocation.delete({
        where: { id, organizationId },
      });

      revalidatePath("/asset-locations");
      return { success: true };
    } catch (error: any) {
      console.error("Failed to delete location:", error);
      return { error: error.message || "Failed to delete location" };
    }
  });
}
