'use server';

import { prisma } from '@/lib/prisma';
import { getActiveOrganizationWithRole } from './organization-action';

export type StockListArgs = {
  page?: number;
  pageSize?: number;
  search?: string;
  warehouseId?: string;
};

export async function getPaginatedStockList({
  page = 1,
  pageSize = 10,
  search,
  warehouseId,
}: StockListArgs) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  // Build where clause
  const where: any = {
    organizationId,
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { code: { contains: search } },
    ];
  }

  // Filter items that have at least one stock in the selected warehouse if warehouseId is provided
  // or just total aggregation if not provided.
  // Actually, we want to see ALL items and their stocks.

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      skip,
      take: safePageSize,
      orderBy: { name: 'asc' },
      include: {
        itemCategory: true,
        stocks: {
          where: warehouseId ? { warehouseId } : undefined,
          include: {
            warehouse: true,
          },
        },
      },
    }),
    prisma.item.count({ where }),
  ]);

  // Aggregate data for the UI
  const data = items.map((item) => {
    const totalStock = item.stocks.reduce((sum, s) => sum + s.quantity, 0);
    const lastUpdated = item.stocks.length > 0 
      ? new Date(Math.max(...item.stocks.map(s => s.updatedAt.getTime())))
      : item.updatedAt;

    return {
      id: item.id,
      code: item.code,
      name: item.name,
      unit: item.unit,
      category: item.itemCategory?.name ?? '-',
      totalStock,
      stocks: item.stocks.map(s => ({
        warehouseName: s.warehouse.name,
        quantity: s.quantity,
        updatedAt: s.updatedAt,
      })),
      lastUpdated,
    };
  });

  return {
    data,
    total,
    pageCount: Math.ceil(total / safePageSize),
    page: safePage,
    pageSize: safePageSize,
  };
}
export async function getStocksForExport({ search, warehouseId }: { search?: string; warehouseId?: string }) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const where: any = {
    organizationId,
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { code: { contains: search } },
    ];
  }

  const items = await prisma.item.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      itemCategory: true,
      stocks: {
        where: warehouseId ? { warehouseId } : undefined,
        include: {
          warehouse: true,
        },
      },
    },
  });

  const data = items.map((item) => {
    const totalStock = item.stocks.reduce((sum, s) => sum + s.quantity, 0);
    return {
      code: item.code,
      name: item.name,
      unit: item.unit,
      category: item.itemCategory?.name ?? '-',
      totalStock,
      warehouseDetails: item.stocks.map(s => `${s.warehouse.name}: ${s.quantity}`).join(' | '),
    };
  });

  return data;
}
