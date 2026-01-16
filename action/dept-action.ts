'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getActiveOrganizationWithRole } from './organization-action';

/* =======================
   TYPES
======================= */
export type GetDepartmentsArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getDepartments({ page, pageSize }: GetDepartmentsArgs) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const safePage = Math.max(1, page);
  const take = Math.max(1, pageSize);
  const skip = (safePage - 1) * take;

  const [data, total] = await Promise.all([
    prisma.department.findMany({
      where: {
        organization_id: organizationId,
      },
      skip,
      take,
      orderBy: {
        nama_department: 'asc',
      },
      include: {
        divisis: true, // hapus kalau tidak perlu
      },
    }),
    prisma.department.count({
      where: {
        organization_id: organizationId,
      },
    }),
  ]);

  return {
    data,
    total,
    pageCount: Math.ceil(total / take),
    page: safePage,
    pageSize: take,
  };
}

/* =======================
   CREATE (ADMIN ONLY)
======================= */
export async function createDepartment(formData: FormData) {
  const { organizationId, role } = await getActiveOrganizationWithRole();

  if (role !== 'owner' && role !== 'admin') {
    throw new Error('Forbidden');
  }

  const kode_department = formData.get('kode_department') as string;
  const nama_department = formData.get('nama_department') as string;
  const id_hod = formData.get('id_hod') as string | null;

  if (!kode_department || !nama_department) {
    throw new Error('Required fields are missing');
  }

  await prisma.department.create({
    data: {
      id_department: crypto.randomUUID(),
      organization_id: organizationId, // ✅ AUTO
      kode_department,
      nama_department,
      id_hod: id_hod ?? '',
    },
  });

  revalidatePath('/department');
}

/* =======================
   UPDATE (ADMIN ONLY)
======================= */
export async function updateDepartment({
  departmentId,
  formData,
}: {
  departmentId: string;
  formData: FormData;
}) {
  const { organizationId, role } = await getActiveOrganizationWithRole();

  if (role !== 'owner' && role !== 'admin') {
    throw new Error('Forbidden');
  }

  const kode_department = formData.get('kode_department') as string;
  const nama_department = formData.get('nama_department') as string;
  const id_hod = formData.get('id_hod') as string | null;

  await prisma.department.update({
    where: {
      id_department: departmentId,
      organization_id: organizationId, // 🔒 safety
    },
    data: {
      kode_department,
      nama_department,
      id_hod: id_hod ?? '',
    },
  });

  revalidatePath('/department');
}

/* =======================
   DELETE (ADMIN ONLY)
======================= */
export async function deleteDepartment(departmentId: string) {
  const { organizationId, role } = await getActiveOrganizationWithRole();

  if (role !== 'owner' && role !== 'admin') {
    throw new Error('Forbidden');
  }

  await prisma.department.delete({
    where: {
      id_department: departmentId,
      organization_id: organizationId,
    },
  });

  revalidatePath('/department');
}

/* =======================
   BULK DELETE (ADMIN ONLY)
======================= */
export async function deleteDepartmentsBulk(departmentIds: string[]) {
  const { organizationId, role } = await getActiveOrganizationWithRole();

  if (role !== 'owner' && role !== 'admin') {
    throw new Error('Forbidden');
  }

  if (!departmentIds || departmentIds.length === 0) return;

  await prisma.department.deleteMany({
    where: {
      id_department: {
        in: departmentIds,
      },
      organization_id: organizationId,
    },
  });

  revalidatePath('/department');
}

/* =======================
   SIMPLE LIST (DROPDOWN)
======================= */
export async function getDepartmentsSimple() {
  const { organizationId } = await getActiveOrganizationWithRole();

  return prisma.department.findMany({
    where: {
      organization_id: organizationId,
    },
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

/* =======================
   OPTIONS (FILTER / FORM)
======================= */
export async function getDepartmentOptions() {
  const { organizationId } = await getActiveOrganizationWithRole();

  return prisma.department.findMany({
    where: {
      organization_id: organizationId,
    },
    orderBy: {
      nama_department: 'asc',
    },
    select: {
      id_department: true,
      nama_department: true,
      organization_id: true,
    },
  });
}
