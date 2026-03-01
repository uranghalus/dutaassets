/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/lib/auth";

import { nanoid } from "nanoid";

export async function seedAdminAndOrganization(prisma: any) {
  console.log("👑 Seeding super admin & organization...");

  const email = "admin@example.com";
  const password = "Admin123!";
  const name = "Super Admin";
  const role = "super_admin";

  // ───────────────────────── USER
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const result = await auth.api.createUser({
      body: { email, password, name, role: role as any },
    });

    user = result.user as any;
    console.log("✅ Super admin created:", email);
  } else {
    console.log("ℹ️ Super admin already exists:", email);
  }

  if (!user) throw new Error("Failed to create or find admin user.");

  // ───────────────────────── ORGANIZATION
  const slug = "default-organization";

  let organization = await prisma.organization.findUnique({
    where: { slug },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        id: nanoid(),
        name: "Default Organization",
        slug,
      },
    });
    console.log("✅ Organization created:", organization.name);
  }

  // ───────────────────────── MEMBER (OWNER)
  const member = await prisma.member.findFirst({
    where: {
      organizationId: organization.id,
      userId: user.id,
      deleted_at: null,
    },
  });

  if (!member) {
    await prisma.member.create({
      data: {
        id: nanoid(),
        organizationId: organization.id,
        userId: user.id,
        role: "owner",
      },
    });
    console.log("✅ Admin assigned as owner");
  }

  // ───────────────────────── MINIMAL DEPARTMENT
  let department = await prisma.department.findFirst({
    where: {
      organization_id: organization.id,
      kode_department: "IT",
    },
  });

  if (!department) {
    department = await prisma.department.create({
      data: {
        organization_id: organization.id,
        kode_department: "IT",
        nama_department: "IT Department",
        id_hod: user.id,
      },
    });
    console.log("✅ Minimal department created");
  }

  // ───────────────────────── MINIMAL DIVISI
  let divisi = await prisma.divisi.findFirst({
    where: {
      organization_id: organization.id,
      nama_divisi: "IT Division",
    },
  });

  if (!divisi) {
    divisi = await prisma.divisi.create({
      data: {
        organization_id: organization.id,
        department_id: department.id_department,
        nama_divisi: "IT Division",
        ext_tlp: "-",
      },
    });
    console.log("✅ Minimal division created");
  }

  // ───────────────────────── ERP BINDING (KARYAWAN)
  const employee = await prisma.karyawan.findFirst({
    where: { userId: user.id },
  });

  if (!employee) {
    await prisma.karyawan.create({
      data: {
        organization_id: organization.id,
        divisi_id: divisi.id_divisi,
        department_id: department.id_department,
        nik: "ADM001",
        nama: "Super Admin",
        nama_alias: "Admin",
        alamat: "-",
        no_ktp: "0000000000000000",
        telp: "-",
        jabatan: "System Administrator",
        call_sign: "ADMIN",
        status_karyawan: "ACTIVE",
        keterangan: "Seeded admin",
        userId: user.id,
      },
    });
    console.log("✅ Admin employee created (ERP binding)");
  }

  return { user, organization };
}
