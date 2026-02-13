"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";

export type SearchResult = {
  id: string;
  type: "ASSET" | "ITEM" | "EMPLOYEE";
  title: string;
  subtitle: string;
  url: string;
};

export async function globalSearch(query: string) {
  if (!query || query.length < 2) return [];

  const { organizationId } = await getActiveOrganizationWithRole();

  const [assets, items, employees] = await Promise.all([
    prisma.asset.findMany({
      where: {
        organization_id: organizationId,
        deleted_at: null,
        OR: [
          { nama_asset: { contains: query } },
          { kode_asset: { contains: query } },
          { serial_number: { contains: query } },
        ],
      },
      take: 5,
      select: { id_barang: true, nama_asset: true, kode_asset: true },
    }),
    prisma.item.findMany({
      where: {
        organizationId,
        OR: [
          { name: { contains: query } },
          { code: { contains: query } },
        ],
      },
      take: 5,
      select: { id: true, name: true, code: true },
    }),
    prisma.karyawan.findMany({
      where: {
        organization_id: organizationId,
        deleted_at: null,
        OR: [
          { nama: { contains: query } },
          { nik: { contains: query } },
        ],
      },
      take: 5,
      select: { id_karyawan: true, nama: true, nik: true },
    }),
  ]);

  const results: SearchResult[] = [
    ...assets.map((a) => ({
      id: a.id_barang,
      type: "ASSET" as const,
      title: a.nama_asset,
      subtitle: a.kode_asset,
      url: `/assets`, // ideally /assets/[id] but listing is fine for now
    })),
    ...items.map((i) => ({
      id: i.id,
      type: "ITEM" as const,
      title: i.name,
      subtitle: i.code,
      url: `/inventory/items`,
    })),
    ...employees.map((e) => ({
      id: e.id_karyawan,
      type: "EMPLOYEE" as const,
      title: e.nama,
      subtitle: e.nik,
      url: `/employees`,
    })),
  ];

  return results;
}
