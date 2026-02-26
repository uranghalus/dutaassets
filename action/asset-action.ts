/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { assetFormSchema } from "@/schema/asset-schema";
import { withContext } from "@/lib/action-utils";
import { getActiveOrganizationWithRole } from "./organization-action";
import { serializePrisma } from "@/lib/utils";
import { requireAssetPermission, getDepartmentFilter } from "@/lib/asset-guard";

// =============================================================================
// READ
// =============================================================================

export async function getAssets({
  page = 0,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const { organizationId, role, departmentId } =
    await getActiveOrganizationWithRole();

  // 🔐 Row-level department filter: global roles see all, others see own dept
  const deptFilter = getDepartmentFilter(role, departmentId);

  const where: any = {
    organization_id: organizationId,
    ...deptFilter,

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

export async function getAssetById(id: string) {
  const { organizationId, role, departmentId } =
    await getActiveOrganizationWithRole();

  // 🔐 Prevent horizontal privilege escalation: non-global roles
  // can only fetch assets from their own department
  const deptFilter = getDepartmentFilter(role, departmentId);

  const asset = await prisma.asset.findFirst({
    where: {
      id_barang: id,
      organization_id: organizationId,
      ...deptFilter,
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

export async function getAssetsForExport({ search = "" }: { search?: string }) {
  const { organizationId, role, departmentId } =
    await getActiveOrganizationWithRole();

  // 🔐 Permission check
  await requireAssetPermission({ asset: ["export"] });

  // 🔐 Row-level scope
  const deptFilter = getDepartmentFilter(role, departmentId);

  const where: any = {
    organization_id: organizationId,
    ...deptFilter,

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

// =============================================================================
// CREATE
// =============================================================================

export async function createAsset(formData: FormData) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    // 🔐 Permission check
    await requireAssetPermission({ asset: ["create"] });

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

    console.log(
      "Creating Asset with Data:",
      JSON.stringify(validatedFields.data, null, 2),
    );

    try {
      const asset = await prisma.asset.create({
        data: {
          ...validatedFields.data,
          organization_id: organizationId,
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

export async function importAssets(assets: any[]) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    // 🔐 Permission check
    await requireAssetPermission({ asset: ["import"] });

    const validatedAssets: any[] = [];
    const errors: string[] = [];

    assets.forEach((asset, index) => {
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

// =============================================================================
// UPDATE
// =============================================================================

export async function updateAsset(id: string, formData: FormData) {
  return withContext(async () => {
    const { organizationId, role, departmentId } =
      await getActiveOrganizationWithRole();

    // 🔐 Permission check
    await requireAssetPermission({ asset: ["edit"] });

    // 🔐 Prevent horizontal privilege escalation:
    // ensure the asset belongs to user's scope before updating
    const deptFilter = getDepartmentFilter(role, departmentId);
    const existing = await prisma.asset.findFirst({
      where: { id_barang: id, organization_id: organizationId, ...deptFilter },
      select: { id_barang: true },
    });
    if (!existing) {
      return { error: "Asset not found or access denied" };
    }

    const rawData = Object.fromEntries(formData.entries());
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

    if (transformedData.tgl_pembelian)
      transformedData.tgl_pembelian = new Date(transformedData.tgl_pembelian);
    if (transformedData.garansi_exp)
      transformedData.garansi_exp = new Date(transformedData.garansi_exp);
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

// =============================================================================
// DELETE
// =============================================================================

export async function deleteAsset(id: string) {
  return withContext(async () => {
    const { organizationId, role, departmentId } =
      await getActiveOrganizationWithRole();

    // 🔐 Permission check
    await requireAssetPermission({ asset: ["delete"] });

    // 🔐 Prevent horizontal privilege escalation
    const deptFilter = getDepartmentFilter(role, departmentId);
    const existing = await prisma.asset.findFirst({
      where: { id_barang: id, organization_id: organizationId, ...deptFilter },
      select: { id_barang: true },
    });
    if (!existing) {
      return { error: "Asset not found or access denied" };
    }

    try {
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
    const { organizationId, role, departmentId } =
      await getActiveOrganizationWithRole();

    // 🔐 Permission check (replaces old hard-coded role === 'owner' check)
    await requireAssetPermission({ asset: ["delete"] });

    if (!ids || ids.length === 0) return;

    // 🔐 Prevent horizontal privilege escalation:
    // only delete assets that fall within the user's department scope
    const deptFilter = getDepartmentFilter(role, departmentId);

    try {
      await prisma.asset.deleteMany({
        where: {
          id_barang: { in: ids },
          organization_id: organizationId,
          ...deptFilter,
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
