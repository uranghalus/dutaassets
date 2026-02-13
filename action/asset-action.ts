"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { assetFormSchema } from "@/schema/asset-schema";
import { withContext } from "@/lib/action-utils";
import { getActiveOrganizationWithRole } from "./organization-action";

export async function getAssets({
  page = 0,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const { organizationId } = await getActiveOrganizationWithRole();

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
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

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
  });
}

export async function updateAsset(id: string, formData: FormData) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

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
  });
}

export async function deleteAsset(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

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
  });
}
export async function getAssetsForExport({ search = "" }: { search?: string }) {
  const { organizationId } = await getActiveOrganizationWithRole();

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

  const data = await prisma.asset.findMany({
    where,
    include: {
      department_fk: true,
      divisi_fk: true,
      karyawan_fk: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return data;
}

export async function importAssets(assets: any[]) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const validatedAssets: any[] = [];
    const errors: string[] = [];

    assets.forEach((asset, index) => {
      // Basic transformations
      const transformed = { ...asset };
      if (transformed.tgl_pembelian) transformed.tgl_pembelian = new Date(transformed.tgl_pembelian);
      if (transformed.garansi_exp) transformed.garansi_exp = new Date(transformed.garansi_exp);
      if (transformed.harga) transformed.harga = parseFloat(transformed.harga);

      const result = assetFormSchema.safeParse(transformed);

      if (result.success) {
        validatedAssets.push({
          ...result.data,
          organization_id: organizationId,
        });
      } else {
        errors.push(`Row ${index + 1}: ${Object.values(result.error.flatten().fieldErrors).flat().join(", ")}`);
      }
    });

    if (errors.length > 0) {
      return { error: "Validation failed", details: errors };
    }

    await prisma.asset.createMany({
      data: validatedAssets,
    });

    revalidatePath("/assets");
    return { success: true, count: validatedAssets.length };
  });
}
