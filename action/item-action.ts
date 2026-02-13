'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withContext } from '@/lib/action-utils';
import { getActiveOrganizationWithRole } from './organization-action';
import { itemFormSchema } from "@/schema/item-schema";

/* =======================
   TYPES
======================= */
export type ItemArgs = {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getItems({ 
  page = 1, 
  pageSize = 10, 
  search = "", 
  categoryId 
}: ItemArgs) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const where: any = {
    organizationId: organizationId,
    OR: search
      ? [
          { name: { contains: search } },
          { code: { contains: search } },
        ]
      : undefined,
    categoryId: categoryId || undefined,
  };

  const [data, total] = await Promise.all([
    prisma.item.findMany({
      where,
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
      where,
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
  const { organizationId } = await getActiveOrganizationWithRole();

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
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

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
  });
}

/* =======================
   UPDATE
======================= */
export async function updateItem(
  id: string,
  formData: FormData
) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

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
  });
}

/* =======================
   DELETE
======================= */
export async function deleteItem(id: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

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
  });
}

/* =======================
   BULK DELETE
======================= */
export async function deleteItemBulk(ids: string[]) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    if (!ids || ids.length === 0) return;

    await prisma.item.deleteMany({
      where: {
        id: { in: ids },
        organizationId: organizationId,
      },
    });

    revalidatePath('/inventory/items');
  });
}

export async function getItemsForExport({ 
  search = "", 
  categoryId 
}: { 
  search?: string; 
  categoryId?: string 
}) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const where: any = {
    organizationId,
    OR: search
      ? [
          { name: { contains: search } },
          { code: { contains: search } },
        ]
      : undefined,
    categoryId: categoryId || undefined,
  };

  const data = await prisma.item.findMany({
    where,
    include: {
      itemCategory: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return data;
}

export async function importItems(items: any[]) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    // Batch validation with Zod
    const validatedItems: any[] = [];
    const errors: string[] = [];

    items.forEach((item, index) => {
      const result = itemFormSchema.safeParse({
        ...item,
        minStock: Number(item.minStock || 0),
      });

      if (result.success) {
        validatedItems.push({
          ...result.data,
          organizationId,
        });
      } else {
        errors.push(`Row ${index + 1}: ${Object.values(result.error.flatten().fieldErrors).flat().join(", ")}`);
      }
    });

    if (errors.length > 0) {
      return { error: "Validation failed", details: errors };
    }

    // Bulk create
    await prisma.item.createMany({
      data: validatedItems,
    });

    revalidatePath('/inventory/items');
    return { success: true, count: validatedItems.length };
  });
}
