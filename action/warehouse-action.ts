'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withContext } from '@/lib/action-utils';

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
  return withContext(async () => {
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
  });
}

/* =======================
   UPDATE
======================= */
export async function updateWarehouse(
  id: string,
  formData: FormData
) {
  return withContext(async () => {
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
  });
}

/* =======================
   DELETE
======================= */
export async function deleteWarehouse(id: string) {
  return withContext(async () => {
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

    await prisma.warehouse.delete({
      where: {
        id,
      },
    });

    revalidatePath('/inventory/warehouses');
  });
}

/* =======================
   BULK DELETE
======================= */
export async function deleteWarehouseBulk(ids: string[]) {
  return withContext(async () => {
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
  });
}
