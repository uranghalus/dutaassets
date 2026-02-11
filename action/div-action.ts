'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* =======================
   TYPES
======================= */
export type DivisiArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION) – ORG SCOPED
======================= */
export async function getDivisions({ page, pageSize }: DivisiArgs) {
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    throw new Error('Unauthorized');
  }

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const where = {
    organization_id: session?.session?.activeOrganizationId,
  };

  const [data, total] = await Promise.all([
    prisma.divisi.findMany({
      where,
      skip,
      take,
      orderBy: { nama_divisi: 'asc' },
      include: {
        department: true,
      },
    }),
    prisma.divisi.count({ where }),
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
   CREATE DIVISION
======================= */
export async function createDivision(formData: FormData) {
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    throw new Error('Unauthorized');
  }

  const nama_divisi = formData.get('nama_divisi')?.toString();
  const department_id = formData.get('department_id')?.toString();
  const ext_tlp = formData.get('ext_tlp')?.toString() ?? '';

  if (!nama_divisi || !department_id) {
    throw new Error('Required fields are missing');
  }

  const divisi = await prisma.divisi.create({
    data: {
      nama_divisi,
      department_id,
      organization_id: session?.session?.activeOrganizationId, // 🔒 dari session
      ext_tlp,
    },
  });

  revalidatePath('/divisions');
  return divisi;
}

/* =======================
   UPDATE DIVISION
======================= */
export async function updateDivisi(divisiId: string, formData: FormData) {
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    throw new Error('Unauthorized');
  }

  const oldDivisi = await prisma.divisi.findFirst({
    where: {
      id_divisi: divisiId,
      organization_id: session.session?.activeOrganizationId, // 🔒 proteksi
    },
  });

  if (!oldDivisi) {
    throw new Error('Divisi not found');
  }

  const nama_divisi = formData.get('nama_divisi')?.toString();
  const department_id = formData.get('department_id')?.toString();
  const ext_tlp = formData.get('ext_tlp')?.toString() ?? '';

  if (!nama_divisi || !department_id) {
    throw new Error('Required fields are missing');
  }

  const updated = await prisma.divisi.update({
    where: { id_divisi: divisiId },
    data: {
      nama_divisi,
      department_id,
      ext_tlp,
    },
  });

  revalidatePath('/divisions');
  return updated;
}

/* =======================
   DELETE
======================= */
export async function deleteDivision(id_divisi: string) {
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    throw new Error('Unauthorized');
  }

  await prisma.divisi.deleteMany({
    where: {
      id_divisi,
      organization_id: session?.session?.activeOrganizationId, // 🔒
    },
  });

  revalidatePath('/divisions');
}

/* =======================
   BULK DELETE
======================= */
export async function deleteDivisionBulk(ids: string[]) {
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    throw new Error('Unauthorized');
  }

  if (!ids || ids.length === 0) return;

  await prisma.divisi.deleteMany({
    where: {
      id_divisi: { in: ids },
      organization_id: session?.session?.activeOrganizationId, // 🔒
    },
  });

  revalidatePath('/divisions');
}

/* =======================
   OPTIONS (DROPDOWN)
======================= */
export async function getDivisionOptions() {
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    throw new Error('Unauthorized');
  }

  return prisma.divisi.findMany({
    where: {
      organization_id: session?.session?.activeOrganizationId,
    },
    select: {
      id_divisi: true,
      nama_divisi: true,
      department_id: true, // 👈 add this
      department: {
        select: {
          nama_department: true,
        },
      },
    },
    orderBy: {
      nama_divisi: 'asc',
    },
  });
}
