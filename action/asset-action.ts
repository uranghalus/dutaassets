/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { assetFormSchema } from "@/schema/asset-schema";
import { withContext } from "@/lib/action-utils";
import { getActiveOrganizationWithRole } from "./organization-action";
import { serializePrisma } from "@/lib/utils";

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
        assetCategory: true,
        assetLocation: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.asset.count({ where }),
  ]);

  return {
    data: serializePrisma(data),
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createAsset(formData: FormData) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const rawData = Object.fromEntries(formData.entries());

    // Transform empty strings to null for optional fields
    const transformedData: any = { ...rawData };

    const optionalFields = [
      "divisi_id",
      "karyawan_id",
      "brand",
      "model",
      "serial_number",
      "lokasi",
      "locationId",
      "deskripsi",
      "vendor",
      "kondisi",
      "tgl_pembelian",
      "garansi_exp",
      "harga",
    ];

    optionalFields.forEach((field) => {
      if (transformedData[field] === "") {
        transformedData[field] = null;
      }
    });

    // Handle dates properly
    if (transformedData.tgl_pembelian)
      transformedData.tgl_pembelian = new Date(transformedData.tgl_pembelian);
    if (transformedData.garansi_exp)
      transformedData.garansi_exp = new Date(transformedData.garansi_exp);

    // Handle number properly
    if (transformedData.harga)
      transformedData.harga = parseFloat(transformedData.harga as string);

    const validatedFields = assetFormSchema.safeParse(transformedData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    // LOGGING FOR DEBUGGING
    console.log(
      "Creating Asset with Data:",
      JSON.stringify(validatedFields.data, null, 2),
    );

    try {
      const asset = await prisma.asset.create({
        data: {
          ...validatedFields.data,
          organization_id: organizationId,
          // Ensure relations are connected properly if provided
          divisi_id: validatedFields.data.divisi_id || null,
          karyawan_id: validatedFields.data.karyawan_id || null,
          locationId: validatedFields.data.locationId || null,
          lokasi: validatedFields.data.lokasi || null,
          categoryId: validatedFields.data.categoryId,
        },
      });

      revalidatePath("/assets");
      return { success: true, data: asset };
    } catch (error: any) {
      console.error("Failed to create asset:", error);
      if (error.code === "P2002") {
        return { error: "Asset code already exists for this organization" };
      }
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

    const optionalFields = [
      "divisi_id",
      "karyawan_id",
      "brand",
      "model",
      "serial_number",
      "lokasi",
      "locationId",
      "deskripsi",
      "vendor",
      "kondisi",
      "tgl_pembelian",
      "garansi_exp",
      "harga",
    ];

    optionalFields.forEach((field) => {
      if (transformedData[field] === "") {
        transformedData[field] = null;
      }
    });

    // Handle dates properly
    if (transformedData.tgl_pembelian)
      transformedData.tgl_pembelian = new Date(transformedData.tgl_pembelian);
    if (transformedData.garansi_exp)
      transformedData.garansi_exp = new Date(transformedData.garansi_exp);

    // Handle number properly
    if (transformedData.harga)
      transformedData.harga = parseFloat(transformedData.harga as string);

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
          locationId: validatedFields.data.locationId || null,
          lokasi: validatedFields.data.lokasi || null,
          categoryId: validatedFields.data.categoryId,
        },
      });

      revalidatePath("/assets");
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update asset:", error);
      if (error.code === "P2002") {
        return { error: "Asset code already exists for this organization" };
      }
      return { error: "Failed to update asset" };
    }
  });
}

export async function deleteAsset(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    try {
      // Hard delete
      await prisma.asset.delete({
        where: { id_barang: id, organization_id: organizationId },
      });

      revalidatePath("/assets");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete asset:", error);
      return { error: "Failed to delete asset" };
    }
  });
}

export async function deleteAssetsBulk(ids: string[]) {
  return withContext(async () => {
    const { organizationId, role } = await getActiveOrganizationWithRole();

    if (role !== "owner" && role !== "admin") {
      throw new Error("Forbidden");
    }

    if (!ids || ids.length === 0) return;

    try {
      await prisma.asset.deleteMany({
        where: {
          id_barang: { in: ids },
          organization_id: organizationId,
        },
      });

      revalidatePath("/assets");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete assets in bulk:", error);
      return { error: "Failed to delete assets in bulk" };
    }
  });
}
export async function getAssetsForExport({ search = "" }: { search?: string }) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const where: any = {
    organization_id: organizationId,

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
      assetCategory: true,
      assetLocation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return serializePrisma(data);
}

export async function importAssets(assets: any[]) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const validatedAssets: any[] = [];
    const errors: string[] = [];

    assets.forEach((asset, index) => {
      // Basic transformations
      const transformed = { ...asset };
      if (transformed.tgl_pembelian)
        transformed.tgl_pembelian = new Date(transformed.tgl_pembelian);
      if (transformed.garansi_exp)
        transformed.garansi_exp = new Date(transformed.garansi_exp);
      if (transformed.harga) transformed.harga = parseFloat(transformed.harga);

      const result = assetFormSchema.safeParse(transformed);

      if (result.success) {
        validatedAssets.push({
          ...result.data,
          organization_id: organizationId,
        });
      } else {
        errors.push(
          `Row ${index + 1}: ${Object.values(result.error.flatten().fieldErrors).flat().join(", ")}`,
        );
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

export async function getAssetById(id: string) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const asset = await prisma.asset.findFirst({
    where: {
      id_barang: id,
      organization_id: organizationId,
    },
    include: {
      department_fk: true,
      divisi_fk: true,
      karyawan_fk: true,
      assetCategory: true,
      assetLocation: true,
    },
  });

  return serializePrisma(asset);
}
