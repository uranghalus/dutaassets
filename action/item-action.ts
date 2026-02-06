'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* =======================
   TYPES
======================= */
export type ItemArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getItems({ page, pageSize }: ItemArgs) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.item.findMany({
      where: {
        organizationId: organizationId,
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
      include: {
        itemCategory: true,
      },
    }),

    prisma.item.count({
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
export async function getItem(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const item = await prisma.item.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
  });

  return item;
}

/* =======================
   CREATE
======================= */
export async function createItem(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const code = formData.get('code')?.toString();
  const name = formData.get('name')?.toString();
  const unit = formData.get('unit')?.toString();
  
  if (!code || !name || !unit) {
    throw new Error('Required fields are missing');
  }

  const category = formData.get('category')?.toString();
  const categoryId = formData.get('categoryId')?.toString();
  const minStock = Number(formData.get('minStock') ?? 0);
  const description = formData.get('description')?.toString();
  const image = formData.get('image')?.toString();

  const item = await prisma.item.create({
    data: {
      code,
      name,
      unit,
      category,
      categoryId,
      minStock,
      description,
      image,
      organizationId,
    },
  });

  revalidatePath('/inventory/items');
  return item;
}

/* =======================
   UPDATE
======================= */
export async function updateItem(
  id: string,
  formData: FormData
) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const item = await prisma.item.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
  });

  if (!item) throw new Error('Item not found');

  const updated = await prisma.item.update({
    where: {
      id,
    },
    data: {
      code: formData.get('code')?.toString() ?? item.code,
      name: formData.get('name')?.toString() ?? item.name,
      unit: formData.get('unit')?.toString() ?? item.unit,
      category: formData.get('category')?.toString() ?? item.category,
      categoryId: formData.get('categoryId')?.toString() ?? item.categoryId,
      minStock: Number(formData.get('minStock') ?? item.minStock),
      description: formData.get('description')?.toString() ?? item.description,
      image: formData.get('image')?.toString() ?? item.image,
    },
  });

  revalidatePath('/inventory/items');
  return updated;
}

/* =======================
   DELETE
======================= */
export async function deleteItem(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const item = await prisma.item.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
  });

  if (!item) throw new Error('Item not found');

  await prisma.item.delete({
    where: {
      id,
    },
  });

  revalidatePath('/inventory/items');
}

/* =======================
   BULK DELETE
======================= */
export async function deleteItemBulk(ids: string[]) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  if (!ids || ids.length === 0) return;

  await prisma.item.deleteMany({
    where: {
      id: { in: ids },
      organizationId: organizationId,
    },
  });

  revalidatePath('/inventory/items');
}
