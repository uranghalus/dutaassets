'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* =======================
   TYPES
======================= */
export type EmployeeArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getEmployees({ page, pageSize }: EmployeeArgs) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.karyawan.findMany({
      where: {
        organization_id: organizationId,
      },
      skip,
      take,
      orderBy: {
        nama: 'asc',
      },
      include: {
        divisi_fk: {
          include: {
            department_fk: true,
          },
        },
      },
    }),

    prisma.karyawan.count({
      where: {
        organization_id: organizationId,
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
   CREATE
======================= */
export async function createEmployee(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const nik = formData.get('nik')?.toString();
  const nama = formData.get('nama')?.toString();
  const divisi_id = formData.get('divisi_id')?.toString();

  if (!nik || !nama || !divisi_id) {
    throw new Error('Required fields are missing');
  }

  const employee = await prisma.karyawan.create({
    data: {
      nik,
      nama,
      divisi_id,
      organization_id: organizationId, // 🔒 AUTO
      nama_alias: formData.get('nama_alias')?.toString() ?? '',
      alamat: formData.get('alamat')?.toString() ?? '',
      no_ktp: formData.get('no_ktp')?.toString() ?? '',
      telp: formData.get('telp')?.toString() ?? '',
      jabatan: formData.get('jabatan')?.toString() ?? '',
      call_sign: formData.get('call_sign')?.toString() ?? '',
      status_karyawan: formData.get('status_karyawan')?.toString() ?? '',
      keterangan: formData.get('keterangan')?.toString() ?? '',
    },
  });

  revalidatePath('/employees');
  return employee;
}

/* =======================
   UPDATE
======================= */
export async function updateEmployee(id_karyawan: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const oldEmployee = await prisma.karyawan.findFirst({
    where: {
      id_karyawan,
      organization_id: organizationId, // 🔒 ownership check
    },
  });

  if (!oldEmployee) throw new Error('Employee not found');

  const updated = await prisma.karyawan.update({
    where: { id_karyawan },
    data: {
      nik: formData.get('nik')?.toString() ?? oldEmployee.nik,
      nama: formData.get('nama')?.toString() ?? oldEmployee.nama,
      divisi_id: formData.get('divisi_id')?.toString() ?? oldEmployee.divisi_id,
      nama_alias: formData.get('nama_alias')?.toString() ?? '',
      alamat: formData.get('alamat')?.toString() ?? '',
      no_ktp: formData.get('no_ktp')?.toString() ?? '',
      telp: formData.get('telp')?.toString() ?? '',
      jabatan: formData.get('jabatan')?.toString() ?? '',
      call_sign: formData.get('call_sign')?.toString() ?? '',
      status_karyawan: formData.get('status_karyawan')?.toString() ?? '',
      keterangan: formData.get('keterangan')?.toString() ?? '',
    },
  });

  revalidatePath('/employees');
  return updated;
}

/* =======================
   DELETE (SINGLE)
======================= */
export async function deleteEmployee(id_karyawan: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  await prisma.karyawan.deleteMany({
    where: {
      id_karyawan,
      organization_id: organizationId, // 🔒 SAFE
    },
  });

  revalidatePath('/employees');
}

/* =======================
   BULK DELETE
======================= */
export async function deleteEmployeeBulk(ids: string[]) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  if (!ids || ids.length === 0) return;

  await prisma.karyawan.deleteMany({
    where: {
      id_karyawan: {
        in: ids,
      },
      organization_id: organizationId, // 🔒 SAFE
    },
  });

  revalidatePath('/employees');
}
