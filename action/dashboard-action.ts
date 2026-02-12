"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

export async function getDashboardStats() {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error("No active organization");

  const [
    assetStats,
    pendingRequisitions,
    items,
    recentLogs
  ] = await Promise.all([
    // 1. Asset Stats
    prisma.asset.groupBy({
      by: ['status'],
      where: { organization_id: organizationId },
      _count: true
    }),

    // 2. Pending Requisitions
    prisma.requisition.count({
      where: {
        organizationId,
        status: {
          in: ['PENDING_SUPERVISOR', 'PENDING_FA', 'PENDING_GM', 'PENDING_WAREHOUSE']
        }
      }
    }),

    // 3. Inventory Stock Stats (Join with Items for minStock)
    prisma.item.findMany({
      where: { organizationId },
      include: {
        stocks: true
      }
    }),

    // 4. Recent Activity Logs
    prisma.activityLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    })
  ]);

  // Process Asset Stats
  const assetCounts = {
    TOTAL: 0,
    AVAILABLE: 0,
    IN_USE: 0,
    MAINTENANCE: 0
  };

  assetStats.forEach(stat => {
    const status = stat.status as keyof typeof assetCounts;
    if (assetCounts[status] !== undefined) {
      assetCounts[status] = stat._count;
      assetCounts.TOTAL += stat._count;
    }
  });

  // Process Low Stock Alerts
  const lowStockItems = items.map(item => {
    const totalStock = item.stocks.reduce((sum, s) => sum + s.quantity, 0);
    return {
      ...item,
      totalStock
    };
  }).filter(item => item.totalStock < item.minStock);

  return {
    assets: assetCounts,
    pendingRequisitions,
    lowStockCount: lowStockItems.length,
    lowStockItems: lowStockItems.slice(0, 5), // Only show top 5 on dashboard
    recentLogs: recentLogs.map(log => ({
        ...log,
        details: typeof log.details === 'string' ? JSON.parse(log.details) : log.details
    }))
  };
}
