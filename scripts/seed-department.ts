/* eslint-disable @typescript-eslint/no-explicit-any */

export async function seedDepartment(prisma: any) {
  console.log("📂 Seeding departments...");

  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("No organization found");

  const seedData = [
    {
      deptCode: "IT",
      deptName: "Information Technology",
      divisions: [
        {
          id: "div-it-support",
          name: "IT Support",
          ext: "101",
          employees: [
            { nik: "IT001", nama: "Budi Santoso", jabatan: "Staff" },
            { nik: "IT002", nama: "Siti Aminah", jabatan: "Supervisor" },
            { nik: "IT003", nama: "Joko Anwar", jabatan: "Manager" },
          ],
        },
      ],
    },
    {
      deptCode: "HRD",
      deptName: "Human Resources Development",
      divisions: [
        {
          id: "div-hr-rec",
          name: "Recruitment",
          ext: "301",
          employees: [
            {
              nik: "HR001",
              nama: "Maya Kartika",
              jabatan: "Staff Administrasi",
            },
          ],
        },
      ],
    },
    {
      deptCode: "FIN",
      deptName: "Finance Accounting & Warehouse",
      divisions: [
        {
          id: "div-fin-asset",
          name: "Asset Management",
          ext: "401",
          employees: [
            { nik: "FIN001", nama: "Rudi Hartono", jabatan: "Finance Manager" },
            { nik: "FIN002", nama: "Dewi Lestari", jabatan: "Staff Asset" },
          ],
        },
      ],
    },
  ];

  for (const deptData of seedData) {
    const dept = await prisma.department.upsert({
      where: {
        organization_id_kode_department: {
          organization_id: org.id,
          kode_department: deptData.deptCode,
        },
      },
      update: {
        nama_department: deptData.deptName,
      },
      create: {
        organization_id: org.id,
        kode_department: deptData.deptCode,
        nama_department: deptData.deptName,
        id_hod: "temp-hod",
      },
    });

    for (const divData of deptData.divisions) {
      const divisi = await prisma.divisi.upsert({
        where: { id_divisi: divData.id },
        update: {
          nama_divisi: divData.name,
          ext_tlp: divData.ext,
          department_id: dept.id_department,
          organization_id: org.id,
        },
        create: {
          id_divisi: divData.id,
          organization_id: org.id,
          department_id: dept.id_department,
          nama_divisi: divData.name,
          ext_tlp: divData.ext,
        },
      });

      for (const emp of divData.employees) {
        await prisma.karyawan.upsert({
          where: {
            organization_id_nik: {
              organization_id: org.id,
              nik: emp.nik,
            },
          },
          update: {
            nama: emp.nama,
            jabatan: emp.jabatan,
          },
          create: {
            organization_id: org.id,
            divisi_id: divisi.id_divisi,
            department_id: dept.id_department,
            nik: emp.nik,
            nama: emp.nama,
            nama_alias: emp.nama.split(" ")[0],
            alamat: "Jl. Merdeka No.1",
            no_ktp: `3201${Math.floor(Math.random() * 1000000000000)}`,
            telp: "08123456789",
            jabatan: emp.jabatan,
            status_karyawan: "Aktif",
            call_sign: emp.nik,
            keterangan: "Seeded",
          },
        });
      }
    }
  }

  console.log("✅ Department seeding done.");
}
