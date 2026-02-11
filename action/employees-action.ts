'use server';

import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

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
        no_ktp:true,
        jabatan: true,
        status_karyawan: true,
        telp: true,
        tempat_lahir: true,
        tgl_lahir: true,
        tgl_masuk: true,
        foto: true,
        userId: true, // 🔗 untuk sync user
        divisi_fk: {
          include: {
            department: true,
          },
        },
        department: true,
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
   GET BY ID
======================= */
export async function getEmployeeById(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const employee = await prisma.karyawan.findFirst({
    where: {
      id_karyawan: id,
      organization_id: organizationId,
    },
    include: {
      divisi_fk: {
        include: {
          department: true,
        },
      },
      department: true,
      user: true,
      assets: {
        where: {
          status: 'IN_USE',
        },
      },
      assetLoans: {
        where: {
          organizationId: organizationId,
        },
        include: {
          asset: true,
        },
        orderBy: {
          loanDate: 'desc',
        },
      },
    },
  });

  return employee;
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
  const department_id = formData.get('department_id')?.toString();

  /* Removed duplicate declarations */

  if (!nik || !nama || !divisi_id || !department_id) {
    throw new Error('Required fields are missing');
  }

  // Handle Foto Upload
  let fotoPath = null;
  const fotoFile = formData.get('foto');
  
  if (fotoFile instanceof File && fotoFile.size > 0) {
    const buffer = Buffer.from(await fotoFile.arrayBuffer());
    const fileName = `${Date.now()}-${fotoFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'employees');
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    fotoPath = `/uploads/employees/${fileName}`;
  }

  const employee = await prisma.karyawan.create({
    data: {
      organization_id: organizationId, // 🔒 auto
      divisi_id,
      department_id,
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
      tempat_lahir: formData.get('tempat_lahir')?.toString() ?? null,
      tgl_lahir: formData.get('tgl_lahir') ? new Date(formData.get('tgl_lahir')!.toString()) : null,
      tgl_masuk: formData.get('tgl_masuk') ? new Date(formData.get('tgl_masuk')!.toString()) : null,
      foto: fotoPath,
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

  // Handle Foto Upload
  let fotoPath = employee.foto;
  const fotoFile = formData.get('foto');

  if (fotoFile instanceof File && fotoFile.size > 0) {
    const buffer = Buffer.from(await fotoFile.arrayBuffer());
    const fileName = `${Date.now()}-${fotoFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'employees');

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Delete old file if exists
    if (employee.foto && employee.foto.startsWith('/uploads/')) {
      try {
        await fs.unlink(path.join(process.cwd(), 'public', employee.foto));
      } catch (err) {
        console.error('Failed to delete old photo:', err);
      }
    }

    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    fotoPath = `/uploads/employees/${fileName}`;
  }

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
      department_id: formData.get('department_id')?.toString() ?? employee.department_id,
      tempat_lahir: formData.get('tempat_lahir')?.toString() ?? employee.tempat_lahir,
      tgl_lahir: formData.get('tgl_lahir') ? new Date(formData.get('tgl_lahir')!.toString()) : employee.tgl_lahir,
      tgl_masuk: formData.get('tgl_masuk') ? new Date(formData.get('tgl_masuk')!.toString()) : employee.tgl_masuk,
      foto: fotoPath,
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

  // Delete photo file if exists
  if (employee.foto && employee.foto.startsWith('/uploads/')) {
    try {
      await fs.unlink(path.join(process.cwd(), 'public', employee.foto));
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
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

  // Get photos to delete
  const employeesToDelete = await prisma.karyawan.findMany({
    where: {
      id_karyawan: { in: ids },
      organization_id: organizationId,
    },
    select: { foto: true },
  });

  for (const emp of employeesToDelete) {
    if (emp.foto && emp.foto.startsWith('/uploads/')) {
      try {
        await fs.unlink(path.join(process.cwd(), 'public', emp.foto));
      } catch (err) {
        console.error('Failed to delete photo:', err);
      }
    }
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
    /**
     * 2️⃣ Add user ke organization
     */
    let roleToAssign = 'member';
    if (employee.jabatan) {
      const roleExists = await prisma.organizationRole.findFirst({
        where: {
          organizationId,
          role: employee.jabatan,
        },
      });
      if (roleExists) {
        roleToAssign = employee.jabatan;
      }
    }

    await auth.api.addMember({
      body: {
        userId,
        organizationId,
        role: roleToAssign as any,
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
