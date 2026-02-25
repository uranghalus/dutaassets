"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { startOfMonth, subMonths, format } from "date-fns";

export async function getAssetReportData() {
  const { organizationId } = await getActiveOrganizationWithRole();

  const assets = await prisma.asset.findMany({
    where: {
      organization_id: organizationId,
    },
    select: {
      harga: true,
      status: true,
      assetCategory: {
        select: { name: true },
      },
    },
  });

  const totalValue = assets.reduce(
    (sum, asset) => sum + Number(asset.harga || 0),
    0,
  );
  const totalCount = assets.length;

  // Group by Status
  const statusDistribution = assets.reduce((acc: any, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusDistribution).map(
    ([name, value]) => ({ name, value }),
  );

  // Group by Category
  const categoryDistribution = assets.reduce((acc: any, asset) => {
    const catName = asset.assetCategory?.name || "Uncategorized";
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryDistribution).map(
    ([name, value]) => ({ name, value }),
  );

  return {
    totalValue,
    totalCount,
    statusData,
    categoryData,
  };
}

export async function getMaintenanceReportData() {
  const { organizationId } = await getActiveOrganizationWithRole();

  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

  const maintenances = await prisma.assetMaintenance.findMany({
    where: {
      organizationId,
      maintenanceDate: { gte: sixMonthsAgo },
    },
    select: {
      cost: true,
      maintenanceDate: true,
    },
  });

  // Group by Month
  const monthlyDataMap = new Map();
  for (let i = 0; i < 6; i++) {
    const month = format(subMonths(new Date(), i), "MMM yyyy");
    monthlyDataMap.set(month, 0);
  }

  maintenances.forEach((m) => {
    const month = format(m.maintenanceDate, "MMM yyyy");
    if (monthlyDataMap.has(month)) {
      monthlyDataMap.set(
        month,
        monthlyDataMap.get(month) + Number(m.cost || 0),
      );
    }
  });

  const costTrend = Array.from(monthlyDataMap.entries())
    .map(([name, cost]) => ({ name, cost }))
    .reverse();

  const totalMaintenanceCost = maintenances.reduce(
    (sum, m) => sum + Number(m.cost || 0),
    0,
  );

  return {
    costTrend,
    totalMaintenanceCost,
  };
}

export async function getInventoryReportData() {
  const { organizationId } = await getActiveOrganizationWithRole();

  const stocks = await prisma.stock.findMany({
    where: {
      warehouse: { organizationId },
    },
    include: {
      item: true,
      warehouse: true,
    },
  });

  // Stock value by warehouse
  const warehouseValueMap = new Map();
  stocks.forEach((s) => {
    const val = Number(s.quantity) * 0; // price field is missing in schema
    const wName = s.warehouse.name;
    warehouseValueMap.set(wName, (warehouseValueMap.get(wName) || 0) + val);
  });

  const warehouseSummary = Array.from(warehouseValueMap.entries()).map(
    ([name, value]) => ({ name, value }),
  );

  // Top items by quantity
  const itemQuantities = stocks.reduce((acc: any, s) => {
    acc[s.item.name] = (acc[s.item.name] || 0) + Number(s.quantity);
    return acc;
  }, {});

  const topItems = Object.entries(itemQuantities)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 5);

  const totalInventoryValue = stocks.reduce(
    (sum, s) => sum + Number(s.quantity) * 0,
    0,
  ); // Using 0 as price field is missing in schema

  return {
    warehouseSummary,
    topItems,
    totalInventoryValue,
  };
}

export async function getLowStockReportData() {
  const { organizationId } = await getActiveOrganizationWithRole();

  const items = await prisma.item.findMany({
    where: { organizationId },
    include: {
      stocks: {
        include: {
          warehouse: true,
        },
      },
      itemCategory: true,
    },
  });

  const lowStockItems = items
    .map((item) => {
      const totalStock = item.stocks.reduce((sum, s) => sum + s.quantity, 0);
      return {
        ...item,
        totalStock,
        warehouseDetails: item.stocks.map((s) => ({
          warehouseName: s.warehouse.name,
          quantity: s.quantity,
        })),
      };
    })
    .filter((item) => item.totalStock < item.minStock);

  return lowStockItems;
}
