/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { withContext } from "@/lib/action-utils";
import { getActiveOrganizationWithRole } from "./organization-action";
import fs from "fs/promises";
import path from "path";

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
  const { organizationId } = await getActiveOrganizationWithRole();

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
        nama: "asc",
      },
      select: {
        id_karyawan: true,
        nik: true,
        nama: true,
        nama_alias: true,
        no_ktp: true,
        jabatan: true,
        status_karyawan: true,
        telp: true,
        tempat_lahir: true,
        tgl_lahir: true,
        tgl_masuk: true,
        tanggal_keluar: true,
        manager_id: true,
        foto: true,
        userId: true, // 🔗 untuk sync user
        divisi_fk: {
          include: {
            department: true,
          },
        },
        department: true,
        manager: {
          select: {
            nama: true,
            jabatan: true,
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
   GET BY ID
======================= */
export async function getEmployeeById(id: string) {
  const { organizationId } = await getActiveOrganizationWithRole();

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
          status: "IN_USE",
        },
        include: {
          item: { include: { category: true } },
        },
      },
      assetLoans: {
        where: {
          organizationId: organizationId,
        },
        include: {
          asset: { include: { item: { include: { category: true } } } },
        },
        orderBy: {
          loanDate: "desc",
        },
      },
    },
  });

  return employee;
}
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function parseDate(value: FormDataEntryValue | null) {
  if (!value) return null;
  const date = new Date(value.toString());
  return isNaN(date.getTime()) ? null : date;
}

async function saveEmployeePhoto(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Format foto tidak valid (jpg, png, webp)");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran foto maksimal 2MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const fileName = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "employees");

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/employees/${fileName}`;
}

async function deleteEmployeePhoto(photoPath: string | null) {
  if (!photoPath) return;

  if (!photoPath.startsWith("/uploads/employees/")) return;

  try {
    const filePath = path.join(process.cwd(), "public", photoPath);
    await fs.unlink(filePath);
  } catch {
    // silent fail (file mungkin sudah tidak ada)
  }
}
/* =======================
   CREATE
======================= */
export async function createEmployee(formData: FormData) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const nik = formData.get("nik")?.toString();
    const nama = formData.get("nama")?.toString();
    const divisi_id = formData.get("divisi_id")?.toString();
    const department_id = formData.get("department_id")?.toString();

    if (!nik || !nama || !divisi_id || !department_id) {
      throw new Error("Required fields are missing");
    }

    return await prisma.$transaction(async (tx) => {
      // Validate Divisi
      const divisi = await tx.divisi.findFirst({
        where: {
          id_divisi: divisi_id,
          organization_id: organizationId,
        },
      });

      if (!divisi) throw new Error("Divisi tidak valid");

      // Validate Department
      const department = await tx.department.findFirst({
        where: {
          id_department: department_id,
          organization_id: organizationId,
        },
      });

      if (!department) throw new Error("Department tidak valid");

      // Validate unique NIK per organization
      const existingNik = await tx.karyawan.findFirst({
        where: {
          nik,
          organization_id: organizationId,
        },
      });

      if (existingNik) {
        throw new Error("NIK sudah terdaftar");
      }

      // Handle foto
      let fotoPath: string | null = null;
      const fotoFile = formData.get("foto");

      if (fotoFile instanceof File && fotoFile.size > 0) {
        fotoPath = await saveEmployeePhoto(fotoFile);
      }

      const jabatan = formData.get("jabatan")?.toString() ?? "";

      const employee = await tx.karyawan.create({
        data: {
          organization_id: organizationId,
          divisi_id,
          department_id,
          nik,
          nama,
          nama_alias: formData.get("nama_alias")?.toString() ?? "",
          alamat: formData.get("alamat")?.toString() ?? "",
          no_ktp: formData.get("no_ktp")?.toString() ?? "",
          telp: formData.get("telp")?.toString() ?? "",
          jabatan,
          call_sign: formData.get("call_sign")?.toString() ?? "",
          status_karyawan: formData.get("status_karyawan")?.toString() ?? "",
          keterangan: formData.get("keterangan")?.toString() ?? "",
          tgl_lahir: parseDate(formData.get("tgl_lahir")),
          tgl_masuk: parseDate(formData.get("tgl_masuk")),
          tanggal_keluar: parseDate(formData.get("tanggal_keluar")),
          manager_id: formData.get("manager_id")?.toString() || null,
          foto: fotoPath,
        } as any,
      });

      // Jika employee langsung di-link ke user, tambahkan sebagai member organisasi
      // dengan role berdasarkan jabatan
      const linkedUserId = formData.get("userId")?.toString();
      if (linkedUserId) {
        // Cek apakah jabatan ada di OrganizationRole
        let roleToAssign = "member";
        if (jabatan) {
          const roleExists = await tx.organizationRole.findFirst({
            where: { organizationId, role: jabatan },
          });
          if (roleExists) roleToAssign = jabatan;
        }

        await auth.api.addMember({
          body: {
            userId: linkedUserId,
            organizationId,
            role: roleToAssign as any,
          },
          headers: await headers(),
        });

        // Simpan userId ke karyawan
        await tx.karyawan.update({
          where: { id_karyawan: employee.id_karyawan },
          data: { userId: linkedUserId },
        });
      }

      revalidatePath("/employees");
      return employee;
    });
  });
}

/* =======================
   UPDATE
======================= */
export async function updateEmployee(id_karyawan: string, formData: FormData) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    return await prisma.$transaction(async (tx) => {
      const employee = await tx.karyawan.findFirst({
        where: {
          id_karyawan,
          organization_id: organizationId,
        },
      });

      if (!employee) throw new Error("Employee not found");

      // Validate NIK uniqueness (if changed)
      const newNik = formData.get("nik")?.toString();

      if (newNik && newNik !== employee.nik) {
        const nikExists = await tx.karyawan.findFirst({
          where: {
            nik: newNik,
            organization_id: organizationId,
          },
        });

        if (nikExists) {
          throw new Error("NIK sudah digunakan");
        }
      }

      // Handle photo
      let fotoPath = employee.foto;
      const fotoFile = formData.get("foto");

      if (fotoFile instanceof File && fotoFile.size > 0) {
        const newPhoto = await saveEmployeePhoto(fotoFile);
        await deleteEmployeePhoto(employee.foto);
        fotoPath = newPhoto;
      }

      const newJabatan =
        formData.get("jabatan")?.toString() ?? employee.jabatan;

      const updated = await tx.karyawan.update({
        where: {
          id_karyawan,
        },
        data: {
          nik: newNik ?? employee.nik,
          nama: formData.get("nama")?.toString() ?? employee.nama,
          nama_alias:
            formData.get("nama_alias")?.toString() ?? employee.nama_alias,
          alamat: formData.get("alamat")?.toString() ?? employee.alamat,
          no_ktp: formData.get("no_ktp")?.toString() ?? employee.no_ktp,
          telp: formData.get("telp")?.toString() ?? employee.telp,
          jabatan: newJabatan,
          call_sign:
            formData.get("call_sign")?.toString() ?? employee.call_sign,
          status_karyawan:
            formData.get("status_karyawan")?.toString() ??
            employee.status_karyawan,
          keterangan:
            formData.get("keterangan")?.toString() ?? employee.keterangan,
          divisi_id:
            formData.get("divisi_id")?.toString() ?? employee.divisi_id,
          department_id:
            formData.get("department_id")?.toString() ?? employee.department_id,
          tempat_lahir:
            formData.get("tempat_lahir")?.toString() ?? employee.tempat_lahir,
          tgl_lahir: parseDate(formData.get("tgl_lahir")) ?? employee.tgl_lahir,
          tgl_masuk:
            parseDate(formData.get("tgl_masuk")) ?? (employee as any).tgl_masuk,
          tanggal_keluar:
            parseDate(formData.get("tanggal_keluar")) ??
            (employee as any).tanggal_keluar,
          manager_id:
            formData.get("manager_id")?.toString() ??
            (employee as any).manager_id,
          foto: fotoPath,
        } as any,
      });

      // Jika employee punya user dan jabatan berubah → update role di organisasi
      if (employee.userId && newJabatan !== employee.jabatan) {
        let roleToAssign = "member";
        if (newJabatan) {
          const roleExists = await tx.organizationRole.findFirst({
            where: { organizationId, role: newJabatan },
          });
          if (roleExists) roleToAssign = newJabatan;
        }

        await auth.api.updateMemberRole({
          body: {
            memberId: employee.userId,
            role: roleToAssign as any,
            organizationId,
          },
          headers: await headers(),
        });
      }

      revalidatePath("/employees");
      return updated;
    });
  });
}

/* =======================
   DELETE (SINGLE)
======================= */
export async function deleteEmployee(id_karyawan: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const employee = await prisma.karyawan.findFirst({
      where: {
        id_karyawan,
        organization_id: organizationId,
      },
    });

    if (!employee) throw new Error("Employee not found");

    // 🛑 optional safety
    if (employee.userId) {
      throw new Error("Employee is linked to a user account. Unlink first.");
    }

    // Delete photo file if exists
    if (employee.foto && employee.foto.startsWith("/uploads/")) {
      try {
        await fs.unlink(path.join(process.cwd(), "public", employee.foto));
      } catch (err) {
        console.error("Failed to delete photo:", err);
      }
    }

    await prisma.karyawan.delete({
      where: {
        id_karyawan,
      },
    });

    revalidatePath("/employees");
  });
}

/* =======================
   BULK DELETE
======================= */
export async function deleteEmployeeBulk(ids: string[]) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    if (!ids || ids.length === 0) return;

    const linked = await prisma.karyawan.count({
      where: {
        id_karyawan: { in: ids },
        organization_id: organizationId,
        userId: { not: null },
      },
    });

    if (linked > 0) {
      throw new Error("Some employees are linked to user accounts");
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
      if (emp.foto && emp.foto.startsWith("/uploads/")) {
        try {
          await fs.unlink(path.join(process.cwd(), "public", emp.foto));
        } catch (err) {
          console.error("Failed to delete photo:", err);
        }
      }
    }

    await prisma.karyawan.deleteMany({
      where: {
        id_karyawan: { in: ids },
        organization_id: organizationId,
      },
    });

    revalidatePath("/employees");
  });
}

/* =======================
   CREATE + SYNC USER
======================= */
export async function syncEmployeeUser(id_karyawan: string) {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const employee = await prisma.karyawan.findFirst({
      where: {
        id_karyawan,
        organization_id: organizationId,
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
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
          role: "user",
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
      let roleToAssign = "member";
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

    revalidatePath("/employees");

    return {
      success: true,
      userId,
    };
  });
}
/* =======================
   OPTIONS (DROPDOWN)
======================= */
export async function getEmployeeOptions() {
  const { organizationId } = await getActiveOrganizationWithRole();

  return prisma.karyawan.findMany({
    where: {
      organization_id: organizationId,
      deleted_at: null,
    },
    select: {
      id_karyawan: true,
      nama: true,
      jabatan: true,
      divisi_id: true,
      department_id: true,
    },
    orderBy: { nama: "asc" },
  });
}

export async function unlinkEmployeeUser(employeeId: string) {
  return withContext(async () => {
    const { organizationId, role } = await getActiveOrganizationWithRole();

    if (!["admin", "owner"].includes(role)) {
      throw new Error("Forbidden");
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
  });
}

/* =======================
   EXPORT
======================= */
export async function getEmployeesForExport({
  search = "",
}: { search?: string } = {}) {
  const { organizationId } = await getActiveOrganizationWithRole();

  const data = await prisma.karyawan.findMany({
    where: {
      organization_id: organizationId,
      ...(search
        ? {
            OR: [
              { nama: { contains: search } },
              { nik: { contains: search } },
              { jabatan: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      divisi_fk: {
        include: { department: true },
      },
      department: true,
    },
    orderBy: { nama: "asc" },
  });

  return data.map((emp) => ({
    nik: emp.nik,
    nama: emp.nama,
    nama_alias: emp.nama_alias ?? "",
    jabatan: emp.jabatan ?? "",
    status_karyawan: emp.status_karyawan ?? "",
    telp: emp.telp ?? "",
    tempat_lahir: emp.tempat_lahir ?? "",
    tgl_lahir: emp.tgl_lahir ? emp.tgl_lahir.toISOString().split("T")[0] : "",
    tgl_masuk: emp.tgl_masuk ? emp.tgl_masuk.toISOString().split("T")[0] : "",
    department: emp.department?.nama_department ?? "",
    divisi: emp.divisi_fk?.nama_divisi ?? "",
    alamat: emp.alamat ?? "",
    no_ktp: emp.no_ktp ?? "",
    call_sign: emp.call_sign ?? "",
    keterangan: emp.keterangan ?? "",
  }));
}

/* =======================
   IMPORT
======================= */
export async function importEmployees(rows: any[]): Promise<{
  success: boolean;
  count?: number;
  error?: string;
  details?: string[];
}> {
  return withContext(async () => {
    const { organizationId } = await getActiveOrganizationWithRole();

    const errors: string[] = [];
    const toCreate: any[] = [];

    // Pre-fetch all divisions & departments for lookup by name
    const [allDivisions, allDepartments] = await Promise.all([
      prisma.divisi.findMany({
        where: { organization_id: organizationId },
        select: { id_divisi: true, nama_divisi: true },
      }),
      prisma.department.findMany({
        where: { organization_id: organizationId },
        select: { id_department: true, nama_department: true },
      }),
    ]);

    const divisiMap = new Map(
      allDivisions.map((d) => [
        d.nama_divisi.toLowerCase().trim(),
        d.id_divisi,
      ]),
    );
    const deptMap = new Map(
      allDepartments.map((d) => [
        d.nama_department.toLowerCase().trim(),
        d.id_department,
      ]),
    );

    rows.forEach((row, i) => {
      const rowNum = i + 1;
      const rowErrors: string[] = [];

      const nik = row["NIK"]?.toString().trim();
      const nama = row["Nama"]?.toString().trim();
      const divisiName = row["Divisi"]?.toString().trim();
      const deptName = row["Department"]?.toString().trim();

      if (!nik) rowErrors.push("NIK wajib diisi");
      if (!nama) rowErrors.push("Nama wajib diisi");
      if (!divisiName) rowErrors.push("Divisi wajib diisi");
      if (!deptName) rowErrors.push("Department wajib diisi");

      const divisiId = divisiName
        ? divisiMap.get(divisiName.toLowerCase())
        : undefined;
      const deptId = deptName ? deptMap.get(deptName.toLowerCase()) : undefined;

      if (divisiName && !divisiId)
        rowErrors.push(`Divisi "${divisiName}" tidak ditemukan`);
      if (deptName && !deptId)
        rowErrors.push(`Department "${deptName}" tidak ditemukan`);

      if (rowErrors.length > 0) {
        errors.push(`Row ${rowNum}: ${rowErrors.join(", ")}`);
        return;
      }

      const tglLahir = row["Tgl Lahir"]?.toString().trim();
      const tglMasuk = row["Tgl Masuk"]?.toString().trim();

      toCreate.push({
        organization_id: organizationId,
        nik,
        nama,
        nama_alias: row["Nama Alias"]?.toString().trim() ?? "",
        jabatan: row["Jabatan"]?.toString().trim() ?? "",
        status_karyawan: row["Status Karyawan"]?.toString().trim() ?? "",
        telp: row["Telepon"]?.toString().trim() ?? "",
        tempat_lahir: row["Tempat Lahir"]?.toString().trim() ?? null,
        tgl_lahir: tglLahir ? new Date(tglLahir) : null,
        tgl_masuk: tglMasuk ? new Date(tglMasuk) : null,
        alamat: row["Alamat"]?.toString().trim() ?? "",
        no_ktp: row["No KTP"]?.toString().trim() ?? "",
        call_sign: row["Call Sign"]?.toString().trim() ?? "",
        keterangan: row["Keterangan"]?.toString().trim() ?? "",
        divisi_id: divisiId,
        department_id: deptId,
      });
    });

    if (errors.length > 0) {
      return { success: false, error: "Validasi gagal", details: errors };
    }

    await prisma.karyawan.createMany({
      data: toCreate,
      skipDuplicates: true,
    });

    revalidatePath("/employees");
    return { success: true, count: toCreate.length };
  }) as Promise<{
    success: boolean;
    count?: number;
    error?: string;
    details?: string[];
  }>;
}
