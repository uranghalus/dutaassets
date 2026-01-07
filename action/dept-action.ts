'use server';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type GetDepartmentsArgs = {
  page: number;
  pageSize: number;
};

export async function getDepartments({ page, pageSize }: GetDepartmentsArgs) {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.department.findMany({
      skip,
      take,
      orderBy: {
        nama_department: 'asc',
      },
      include: {
        divisis: true, // hapus kalau tidak perlu relasi
      },
    }),
    prisma.department.count(),
  ]);

  return {
    data,
    total,
    pageCount: Math.ceil(total / safePageSize),
    page: safePage,
    pageSize: safePageSize,
  };
}
export async function createDepartment(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const kode_department = formData.get('kode_department') as string;
  const nama_department = formData.get('nama_department') as string;
  const id_hod = formData.get('id_hod') as string | null;

  await prisma.department.create({
    data: {
      id_department: crypto.randomUUID(),
      kode_department,
      nama_department,
      id_hod: id_hod || '',
    },
  });

  revalidatePath('/department');
}
export async function updateDepartment({
  departmentId,
  formData,
}: {
  departmentId: string;
  formData: FormData;
}) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const kode_department = formData.get('kode_department') as string;
  const nama_department = formData.get('nama_department') as string;
  const id_hod = formData.get('id_hod') as string | null;

  await prisma.department.update({
    where: { id_department: departmentId },
    data: {
      kode_department,
      nama_department,
      id_hod: id_hod || '',
    },
  });

  revalidatePath('/department');
}
export async function deleteDepartment(departmentId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.department.delete({
    where: { id_department: departmentId },
  });

  revalidatePath('/department');
}
export async function deleteDepartmentsBulk(departmentIds: string[]) {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!departmentIds || departmentIds.length === 0) {
    return;
  }

  await prisma.department.deleteMany({
    where: {
      id_department: {
        in: departmentIds,
      },
    },
  });

  // sesuaikan path dengan route halaman department kamu
  revalidatePath('/department');
}
export async function getDepartmentsSimple() {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return prisma.department.findMany({
    select: {
      id_department: true,
      nama_department: true,
      kode_department: true,
    },
    orderBy: {
      nama_department: 'asc',
    },
  });
}
