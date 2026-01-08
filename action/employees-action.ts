'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* =======================
   TYPES
======================= */
export type employeeArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getEmployees({ page, pageSize }: employeeArgs) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.karyawan.findMany({
      skip,
      take,
      orderBy: {
        nama: 'asc',
      },
      include: {
        divisi_fk: true,
      },
    }),
    prisma.karyawan.count(),
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

  const nik = formData.get('nik');
  const nama = formData.get('nama');
  const nama_alias = formData.get('nama_alias');
  const alamat = formData.get('alamat');
  const no_ktp = formData.get('no_ktp');
  const telp = formData.get('telp');
  const divisi_id = formData.get('divisi_id');
  const jabatan = formData.get('jabatan');
  const call_sign = formData.get('call_sign');
  const status_karyawan = formData.get('status_karyawan');
  const keterangan = formData.get('keterangan');

  if (!nik || !nama || !divisi_id) {
    throw new Error('Required fields are missing');
  }

  const employee = await prisma.karyawan.create({
    data: {
      nik: nik as string,
      nama: nama as string,
      nama_alias: (nama_alias as string) ?? '',
      alamat: (alamat as string) ?? '',
      no_ktp: (no_ktp as string) ?? '',
      telp: (telp as string) ?? '',
      divisi_id: divisi_id as string,
      jabatan: (jabatan as string) ?? '',
      call_sign: (call_sign as string) ?? '',
      status_karyawan: (status_karyawan as string) ?? '',
      keterangan: (keterangan as string) ?? '',
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

  const oldEmployee = await prisma.karyawan.findUnique({
    where: { id_karyawan },
  });

  if (!oldEmployee) throw new Error('Employee not found');

  const data = {
    nik: formData.get('nik') as string,
    nama: formData.get('nama') as string,
    nama_alias: formData.get('nama_alias') as string,
    alamat: formData.get('alamat') as string,
    no_ktp: formData.get('no_ktp') as string,
    telp: formData.get('telp') as string,
    divisi_id: formData.get('divisi_id') as string,
    jabatan: formData.get('jabatan') as string,
    call_sign: formData.get('call_sign') as string,
    status_karyawan: formData.get('status_karyawan') as string,
    keterangan: formData.get('keterangan') as string,
  };

  const updated = await prisma.karyawan.update({
    where: { id_karyawan },
    data,
  });

  revalidatePath('/employees');
  return updated;
}

/* =======================
   DELETE
======================= */
export async function deleteEmployee(id_karyawan: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.karyawan.delete({
    where: { id_karyawan },
  });

  revalidatePath('/employees');
}

/* =======================
   BULK DELETE
======================= */
export async function deleteEmployeeBulk(ids: string[]) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  if (!ids || ids.length === 0) return;

  await prisma.karyawan.deleteMany({
    where: {
      id_karyawan: {
        in: ids,
      },
    },
  });

  revalidatePath('/employees');
}
