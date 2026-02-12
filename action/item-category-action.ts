'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withContext } from '@/lib/action-utils';

/* =======================
   TYPES
======================= */
export type ItemCategoryArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getItemCategories({ page, pageSize }: ItemCategoryArgs) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.itemCategory.findMany({
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
          select: { items: true },
        },
      },
    }),

    prisma.itemCategory.count({
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
   GET ALL (FOR SELECT)
======================= */
export async function getAllItemCategories() {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const categories = await prisma.itemCategory.findMany({
    where: {
      organizationId: organizationId,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return categories;
}

/* =======================
   GET SINGLE
======================= */
export async function getItemCategory(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const category = await prisma.itemCategory.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
  });

  return category;
}

/* =======================
   CREATE
======================= */
export async function createItemCategory(formData: FormData) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    const name = formData.get('name')?.toString();

    if (!name) {
      throw new Error('Required fields are missing');
    }

    const description = formData.get('description')?.toString();

    const category = await prisma.itemCategory.create({
      data: {
        name,
        description,
        organizationId,
      },
    });

    revalidatePath('/inventory/categories');
    return category;
  });
}

/* =======================
   UPDATE
======================= */
export async function updateItemCategory(
  id: string,
  formData: FormData
) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    const category = await prisma.itemCategory.findFirst({
      where: {
        id,
        organizationId: organizationId,
      },
    });

    if (!category) throw new Error('Category not found');

    const updated = await prisma.itemCategory.update({
      where: {
        id,
      },
      data: {
        name: formData.get('name')?.toString() ?? category.name,
        description: formData.get('description')?.toString() ?? category.description,
      },
    });

    revalidatePath('/inventory/categories');
    return updated;
  });
}

/* =======================
   DELETE
======================= */
export async function deleteItemCategory(id: string) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    const category = await prisma.itemCategory.findFirst({
      where: {
        id,
        organizationId: organizationId,
      },
    });

    if (!category) throw new Error('Category not found');

    await prisma.itemCategory.delete({
      where: {
        id,
      },
    });

    revalidatePath('/inventory/categories');
  });
}

/* =======================
   BULK DELETE
======================= */
export async function deleteItemCategoryBulk(ids: string[]) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    if (!ids || ids.length === 0) return;

    await prisma.itemCategory.deleteMany({
      where: {
        id: { in: ids },
        organizationId: organizationId,
      },
    });

    revalidatePath('/inventory/categories');
  });
}
