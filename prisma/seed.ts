/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

async function seedAdmin() {
  const email = 'admin@example.com';
  const password = 'Admin123!';
  const name = 'Super Admin';
  const role = 'super_admin'; // lebih cocok untuk ERP

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('✅ Admin sudah ada:', existing.email);
    return existing;
  }

  const result = await auth.api.createUser({
    body: { email, password, name, role: role as any },
  });

  console.log('🎉 Admin berhasil dibuat!');
  console.log('Email:', result.user.email);
  console.log('Password:', password);

  return result.user;
}

async function seedOrganizationWithStructure(adminId: string) {
  const slug = 'default-organization';

  let organization = await prisma.organization.findUnique({
    where: { slug },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        id: nanoid(),
        name: 'Default Organization',
        slug,
      },
    });

    console.log('🎉 Organization dibuat:', organization.name);
  } else {
    console.log('✅ Organization sudah ada:', organization.slug);
  }

  // 🔐 Ensure Member (Better Auth compatibility)
  const existingMember = await prisma.member.findFirst({
    where: {
      organizationId: organization.id,
      userId: adminId,
      deleted_at: null,
    },
  });

  if (!existingMember) {
    await prisma.member.create({
      data: {
        id: nanoid(),
        organizationId: organization.id,
        userId: adminId,
        role: 'owner',
      },
    });

    console.log('✅ Member owner dibuat untuk admin');
  }

  // 🏢 Minimal Department (karena Karyawan butuh department)
  let department = await prisma.department.findFirst({
    where: {
      organization_id: organization.id,
      kode_department: 'IT',
    },
  });

  if (!department) {
    department = await prisma.department.create({
      data: {
        organization_id: organization.id,
        kode_department: 'IT',
        nama_department: 'IT Department',
        id_hod: adminId,
      },
    });

    console.log('✅ Department dibuat');
  }

  // 🏢 Minimal Divisi
  let divisi = await prisma.divisi.findFirst({
    where: {
      organization_id: organization.id,
      nama_divisi: 'IT Division',
    },
  });

  if (!divisi) {
    divisi = await prisma.divisi.create({
      data: {
        organization_id: organization.id,
        department_id: department.id_department,
        nama_divisi: 'IT Division',
        ext_tlp: '-',
      },
    });

    console.log('✅ Divisi dibuat');
  }

  // 👤 ERP Binding: Karyawan untuk Admin
  const existingEmployee = await prisma.karyawan.findFirst({
    where: {
      userId: adminId,
    },
  });

  if (!existingEmployee) {
    await prisma.karyawan.create({
      data: {
        organization_id: organization.id,
        divisi_id: divisi.id_divisi,
        department_id: department.id_department,

        nik: 'ADM001',
        nama: 'Super Admin',
        nama_alias: 'Admin',
        alamat: '-',
        no_ktp: '0000000000000000',
        telp: '-',
        jabatan: 'System Administrator',
        call_sign: 'ADMIN',
        status_karyawan: 'ACTIVE',
        keterangan: 'Seeded admin',

        userId: adminId,
      },
    });

    console.log('✅ Karyawan admin dibuat (ERP binding)');
  }

  return organization;
}

async function main() {
  const admin = await seedAdmin();

  if (!admin?.id) {
    throw new Error('Admin gagal dibuat.');
  }

  await seedOrganizationWithStructure(admin.id);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
