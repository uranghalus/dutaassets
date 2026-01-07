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
  const data = {
    id_divisi: formData.get('id_divisi') as string,
    nama_divisi: formData.get('nama_divisi') as string,
    department_id: formData.get('department_id') as string,
    ext_tlp: formData.get('ext_tlp') as string,
  };
  const divisi = await prisma.divisi.create({ data });
  revalidatePath('/divisions');
  return divisi;
}
export async function updateDivisi(divisiId: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const oldDivisi = await prisma.divisi.findUnique({
    where: { id_divisi: divisiId },
  });

  if (!oldDivisi) throw new Error('Divisi not found');

  const data = {
    nama_divisi: formData.get('nama_divisi') as string,
    department_id: formData.get('department_id') as string,
    ext_tlp: formData.get('ext_tlp') as string,
  };

  const updated = await prisma.divisi.update({
    where: { id_divisi: divisiId },
    data,
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
