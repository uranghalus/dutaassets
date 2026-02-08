"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { assetFormSchema } from "@/schema/asset-schema";

export async function getAssets({
  page = 0,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
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

  const where: any = {
    organization_id: organizationId,
    deleted_at: null,
    OR: search
      ? [
          { nama_asset: { contains: search } },
          { kode_asset: { contains: search } },
          { brand: { contains: search } },
          { serial_number: { contains: search } },
        ]
      : undefined,
  };

  const [data, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        department_fk: true,
        divisi_fk: true,
        karyawan_fk: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.asset.count({ where }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createAsset(formData: FormData) {
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

  const rawData = Object.fromEntries(formData.entries());
  
  // Transform empty strings to null for optional fields
  const transformedData: any = { ...rawData };
  
  const optionalFields = ["divisi_id", "karyawan_id", "brand", "model", "serial_number", "lokasi", "deskripsi", "vendor", "kondisi", "tgl_pembelian", "garansi_exp", "harga"];
  
  optionalFields.forEach(field => {
      if (transformedData[field] === "") {
          transformedData[field] = null;
      }
  });

  // Handle dates properly
  if (transformedData.tgl_pembelian) transformedData.tgl_pembelian = new Date(transformedData.tgl_pembelian);
  if (transformedData.garansi_exp) transformedData.garansi_exp = new Date(transformedData.garansi_exp);
  
  // Handle number properly
  if (transformedData.harga) transformedData.harga = parseFloat(transformedData.harga as string);


  const validatedFields = assetFormSchema.safeParse(transformedData);

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const asset = await prisma.asset.create({
      data: {
        ...validatedFields.data,
        organization_id: organizationId,
        // Ensure relations are connected properly if provided
        divisi_id: validatedFields.data.divisi_id || null,
        karyawan_id: validatedFields.data.karyawan_id || null,
      },
    });

    revalidatePath("/assets");
    return { success: true, data: asset };
  } catch (error) {
    console.error("Failed to create asset:", error);
    return { error: "Failed to create asset" };
  }
}

export async function updateAsset(id: string, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  
  const organizationId = session.session.activeOrganizationId;
  
    const rawData = Object.fromEntries(formData.entries());
  
  // Transform empty strings to null for optional fields
  const transformedData: any = { ...rawData };
  
  const optionalFields = ["divisi_id", "karyawan_id", "brand", "model", "serial_number", "lokasi", "deskripsi", "vendor", "kondisi", "tgl_pembelian", "garansi_exp", "harga"];
  
  optionalFields.forEach(field => {
      if (transformedData[field] === "") {
          transformedData[field] = null;
      }
  });

  // Handle dates properly
  if (transformedData.tgl_pembelian) transformedData.tgl_pembelian = new Date(transformedData.tgl_pembelian);
  if (transformedData.garansi_exp) transformedData.garansi_exp = new Date(transformedData.garansi_exp);
  
  // Handle number properly
  if (transformedData.harga) transformedData.harga = parseFloat(transformedData.harga as string);


  const validatedFields = assetFormSchema.safeParse(transformedData);

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.asset.update({
      where: { id_barang: id, organization_id: organizationId },
      data: {
         ...validatedFields.data,
         divisi_id: validatedFields.data.divisi_id || null,
         karyawan_id: validatedFields.data.karyawan_id || null,
      },
    });

    revalidatePath("/assets");
    return { success: true };
  } catch (error) {
    console.error("Failed to update asset:", error);
    return { error: "Failed to update asset" };
  }
}

export async function deleteAsset(id: string) {
    const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  
  const organizationId = session.session.activeOrganizationId;

  try {
    // Soft delete
    await prisma.asset.update({
      where: { id_barang: id, organization_id: organizationId },
      data: { deleted_at: new Date() },
    });

    revalidatePath("/assets");
    return { success: true };
  } catch (error) {
     console.error("Failed to delete asset:", error);
    return { error: "Failed to delete asset" };
  }
}
