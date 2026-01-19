'use server';

import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

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
      select: {
        id_karyawan: true,
        nik: true,
        nama: true,
        nama_alias: true,
        jabatan: true,
        status_karyawan: true,
        telp: true,
        userId: true, // 🔗 untuk sync user
        divisi_fk: {
          include: {
            department_fk: true,
          },
        },
        createdAt: true,
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
      organization_id: organizationId, // 🔒 auto
      divisi_id,
      nik,
      nama,
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

  const employee = await prisma.karyawan.findFirst({
    where: {
      id_karyawan,
      organization_id: organizationId, // 🔒 ownership
    },
  });

  if (!employee) throw new Error('Employee not found');

  const updated = await prisma.karyawan.update({
    where: {
      id_karyawan,
    },
    data: {
      nik: formData.get('nik')?.toString() ?? employee.nik,
      nama: formData.get('nama')?.toString() ?? employee.nama,
      nama_alias: formData.get('nama_alias')?.toString() ?? employee.nama_alias,
      alamat: formData.get('alamat')?.toString() ?? employee.alamat,
      no_ktp: formData.get('no_ktp')?.toString() ?? employee.no_ktp,
      telp: formData.get('telp')?.toString() ?? employee.telp,
      jabatan: formData.get('jabatan')?.toString() ?? employee.jabatan,
      call_sign: formData.get('call_sign')?.toString() ?? employee.call_sign,
      status_karyawan:
        formData.get('status_karyawan')?.toString() ?? employee.status_karyawan,
      keterangan: formData.get('keterangan')?.toString() ?? employee.keterangan,
      divisi_id: formData.get('divisi_id')?.toString() ?? employee.divisi_id,
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

  const employee = await prisma.karyawan.findFirst({
    where: {
      id_karyawan,
      organization_id: organizationId,
    },
  });

  if (!employee) throw new Error('Employee not found');

  // 🛑 optional safety
  if (employee.userId) {
    throw new Error('Employee is linked to a user account. Unlink first.');
  }

  await prisma.karyawan.delete({
    where: {
      id_karyawan,
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

  const linked = await prisma.karyawan.count({
    where: {
      id_karyawan: { in: ids },
      organization_id: organizationId,
      userId: { not: null },
    },
  });

  if (linked > 0) {
    throw new Error('Some employees are linked to user accounts');
  }

  await prisma.karyawan.deleteMany({
    where: {
      id_karyawan: { in: ids },
      organization_id: organizationId,
    },
  });

  revalidatePath('/employees');
}

/* =======================
   CREATE + SYNC USER
======================= */
export async function syncEmployeeUser(id_karyawan: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const employee = await prisma.karyawan.findFirst({
    where: {
      id_karyawan,
      organization_id: organizationId,
    },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  /**
   * 1️⃣ Jika belum punya user → CREATE USER
   */
  let userId = employee.userId;

  if (!userId) {
    const email = `${employee.nik}@company.local`;

    const newUser = await auth.api.createUser({
      body: {
        email,
        password: `Emp@${employee.nik}`, // ⚠️ bisa diganti invite flow
        name: employee.nama,
        role: 'user',
        data: {
          employeeId: employee.id_karyawan,
        },
      },
    });

    userId = newUser.user.id;

    /**
     * 2️⃣ Add user ke organization
     */
    await auth.api.addMember({
      body: {
        userId,
        organizationId,
        role: 'member',
      },
      headers: await headers(),
    });

    /**
     * 3️⃣ Simpan user_id ke karyawan
     */
    await prisma.karyawan.update({
      where: { id_karyawan },
      data: {
        userId: userId,
      },
    });
  }

  /**
   * 4️⃣ Sync data (update nama, metadata)
   */
  await auth.api.adminUpdateUser({
    body: {
      userId,
      data: {
        name: employee.nama,
      },
    },
    headers: await headers(),
  });

  revalidatePath('/employees');

  return {
    success: true,
    userId,
  };
}
export async function unlinkEmployeeUser(employeeId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const member = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId,
    },
  });

  if (!member || !['admin', 'owner'].includes(member.role)) {
    throw new Error('Forbidden');
  }

  await prisma.karyawan.update({
    where: {
      id_karyawan: employeeId,
      organization_id: organizationId,
    },
    data: {
      userId: null,
    },
  });
}
