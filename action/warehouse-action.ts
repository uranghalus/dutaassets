'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* =======================
   TYPES
======================= */
export type WarehouseArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getWarehouses({ page, pageSize }: WarehouseArgs) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.warehouse.findMany({
      where: {
        organizationId: organizationId,
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
            select: { stocks: true }
        }
      }
    }),

    prisma.warehouse.count({
      where: {
        organizationId: organizationId,
      },
    }),
  ]);

  return {
    data,
    total,
    pageCount: Math.ceil(total / safePageSize),
    page: safePage,
    pageSize: safePageSize,
  };
}

/* =======================
   GET SINGLE
======================= */
export async function getWarehouse(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const warehouse = await prisma.warehouse.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
  });

  return warehouse;
}

/* =======================
   CREATE
======================= */
export async function createWarehouse(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const name = formData.get('name')?.toString();
  const location = formData.get('location')?.toString() ?? '';

  if (!name) {
    throw new Error('Required fields are missing');
  }

  const warehouse = await prisma.warehouse.create({
    data: {
      name,
      location,
      organizationId,
    },
  });

  revalidatePath('/inventory/warehouses');
  return warehouse;
}

/* =======================
   UPDATE
======================= */
export async function updateWarehouse(
  id: string,
  formData: FormData
) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const warehouse = await prisma.warehouse.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
  });

  if (!warehouse) throw new Error('Warehouse not found');

  const updated = await prisma.warehouse.update({
    where: {
      id,
    },
    data: {
      name: formData.get('name')?.toString() ?? warehouse.name,
      location: formData.get('location')?.toString() ?? warehouse.location,
    },
  });

  revalidatePath('/inventory/warehouses');
  return updated;
}

/* =======================
   DELETE
======================= */
export async function deleteWarehouse(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const warehouse = await prisma.warehouse.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
  });

  if (!warehouse) throw new Error('Warehouse not found');

  // Check generic constraint if needed (e.g., if has stocks)
  // For now, cascade might not be set or we want to prevent deletion if stocks exist.
  // Prisma schema didn't define cascade on User? 
  // Let's assume we allow deletion for now or Prisma handles it. 
  // Wait, stock has @relation(fields: [warehouseId], references: [id])
  // If we delete warehouse, stock deletion depends on onDelete. 
  // Schema didn't specify onDelete for Stock->Warehouse. Default is RESTRICT (usually) or NO ACTION.
  // Better to be safe, but adhering to requested minimal CRUD.
  
  await prisma.warehouse.delete({
    where: {
      id,
    },
  });

  revalidatePath('/inventory/warehouses');
}

/* =======================
   BULK DELETE
======================= */
export async function deleteWarehouseBulk(ids: string[]) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  if (!ids || ids.length === 0) return;

  await prisma.warehouse.deleteMany({
    where: {
      id: { in: ids },
      organizationId: organizationId,
    },
  });

  revalidatePath('/inventory/warehouses');
}
