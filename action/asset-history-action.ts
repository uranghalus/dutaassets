"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { withContext } from "@/lib/action-utils";

export type AssetHistoryType = "TRANSFER" | "LOAN" | "MAINTENANCE" | "LOG";

export type AssetHistoryItem = {
  id: string;
  type: AssetHistoryType;
  action: string;
  date: Date;
  details: any;
  user?: { name: string; email: string };
};

export async function getAssetHistory({
  assetId,
  search = "",
  page = 0,
  pageSize = 10,
}: {
  assetId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const commonWhere: any = {
      organizationId,
      assetId: assetId || undefined,
    };

    if (search) {
      commonWhere.asset = {
        OR: [
          { nama_asset: { contains: search } },
          { kode_asset: { contains: search } },
        ],
      };
    }

    // 1. Fetch from ActivityLog
    const logs = await prisma.activityLog.findMany({
      where: {
        organizationId,
        entityType: "Asset", // Extension uses "Asset" (PascalCase from Model name)
        entityId: assetId || undefined,
      },
      include: { 
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // To get asset names for logs, we fetch the corresponding assets
    const assetIds = [...new Set(logs.map(l => l.entityId).filter(id => !!id))] as string[];
    const assetMap = new Map();
    if (assetIds.length > 0) {
      const assetsForLogs = await prisma.asset.findMany({
        where: { id_barang: { in: assetIds } },
        select: { id_barang: true, nama_asset: true, kode_asset: true }
      });
      assetsForLogs.forEach(a => assetMap.set(a.id_barang, a));
    }

    // 2. Fetch from AssetTransfer
    const transfers = await prisma.assetTransfer.findMany({
      where: commonWhere,
      include: {
        asset: true,
        fromLocation: true,
        toLocation: true,
        fromEmployee: true,
        toEmployee: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // 3. Fetch from AssetLoan
    const loans = await prisma.assetLoan.findMany({
      where: commonWhere,
      include: {
        asset: true,
        employee: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // 4. Fetch from AssetMaintenance
    const maintenances = await prisma.assetMaintenance.findMany({
      where: commonWhere,
      include: { asset: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // Normalization
    const history: AssetHistoryItem[] = [
      ...logs.map((l) => {
        const asset = l.entityId ? assetMap.get(l.entityId) : null;
        return {
          id: l.id,
          type: "LOG" as const,
          action: l.action,
          date: l.createdAt,
          details: {
            ...((l.details as any) || {}),
            assetName: asset?.nama_asset || "System",
            assetCode: asset?.kode_asset || "",
          },
          user: l.user ? { name: l.user.name, email: l.user.email } : undefined,
        };
      }),
      ...transfers.map((t) => ({
        id: t.id,
        type: "TRANSFER" as const,
        action: `MOVEMENT_${t.status}`,
        date: t.transferDate,
        details: {
          assetName: t.asset.nama_asset,
          assetCode: t.asset.kode_asset,
          from: t.fromLocation?.name || t.fromEmployee?.nama || "Unknown",
          to: t.toLocation?.name || t.toEmployee?.nama || "Unknown",
          remarks: t.remarks,
        },
      })),
      ...loans.map((l) => ({
        id: l.id,
        type: "LOAN" as const,
        action: `LOAN_${l.status}`,
        date: l.loanDate,
        details: {
          assetName: l.asset.nama_asset,
          assetCode: l.asset.kode_asset,
          employee: l.employee.nama,
          notes: l.notes,
        },
      })),
      ...maintenances.map((m) => ({
        id: m.id,
        type: "MAINTENANCE" as const,
        action: `MAINTENANCE_${m.status}`,
        date: m.maintenanceDate,
        details: {
          assetName: m.asset.nama_asset,
          assetCode: m.asset.kode_asset,
          type: m.type,
          cost: m.cost.toString(),
          description: m.description,
        },
      })),
    ];

    // Sort combined history
    const sortedHistory = history.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Manual pagination for unified results
    const total = sortedHistory.length;
    const paginatedData = sortedHistory.slice(page * pageSize, (page + 1) * pageSize);

    return {
      data: paginatedData,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  });
}
