'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type divaArgs = {
  page: number;
  pageSize: number;
};
export async function getDivisions({ page, pageSize }: divaArgs) {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.divisi.findMany({
      skip,
      take,
      orderBy: {
        nama_divisi: 'asc',
      },
      include: {
        department_fk: true,
      },
    }),
    prisma.divisi.count(),
  ]);
  return {
    data,
    total,
    pageCount: Math.ceil(total / safePageSize),
    page: safePage,
    pageSize: safePageSize,
  };
}
export async function createDivision(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const nama_divisi = formData.get('nama_divisi')?.toString();
  const department_id = formData.get('department_id')?.toString();
  const organization_id = formData.get('organization_id')?.toString();
  const ext_tlp = formData.get('ext_tlp')?.toString() ?? '';

  if (!nama_divisi || !department_id || !organization_id) {
    throw new Error('Required fields are missing');
  }

  const divisi = await prisma.divisi.create({
    data: {
      nama_divisi,
      department_id,
      organization_id,
      ext_tlp,
    },
  });

  // ✅ ganti sesuai halaman divisi kamu
  revalidatePath('/divisions');

  return divisi;
}
/* =========================
   UPDATE DIVISION
========================= */
export async function updateDivisi(divisiId: string, formData: FormData) {
  console.log('Form Data', formData);
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const oldDivisi = await prisma.divisi.findUnique({
    where: { id_divisi: divisiId },
  });

  if (!oldDivisi) {
    throw new Error('Divisi not found');
  }

  const nama_divisi = formData.get('nama_divisi')?.toString();
  const department_id = formData.get('department_id')?.toString();
  const organization_id = formData.get('organization_id')?.toString();
  const ext_tlp = formData.get('ext_tlp')?.toString() ?? '';

  if (!nama_divisi || !department_id || !organization_id) {
    throw new Error('Required fields are missing');
  }

  const updated = await prisma.divisi.update({
    where: { id_divisi: divisiId },
    data: {
      nama_divisi,
      department_id,
      organization_id,
      ext_tlp,
    },
  });

  revalidatePath('/divisions');

  return updated;
}
export async function deleteDivision(id_divisi: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  await prisma.divisi.delete({
    where: { id_divisi: id_divisi },
  });
  revalidatePath('/divisions');
}
export async function deleteDivisionBulk(id_divisi: string[]) {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!id_divisi || id_divisi.length === 0) {
    return;
  }
  await prisma.divisi.deleteMany({
    where: {
      id_divisi: {
        in: id_divisi,
      },
    },
  });
  revalidatePath('/divisions');
}
export async function getDivisionOptions(organizationId: string) {
  return prisma.divisi.findMany({
    where: {
      organization_id: organizationId, // ✅ FILTER
    },
    select: {
      id_divisi: true,
      nama_divisi: true,
    },
    orderBy: {
      nama_divisi: 'asc',
    },
  });
}
