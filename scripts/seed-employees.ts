
import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding departments, divisions, and employees...');

  // 1. Get Active Organization
  const org = await prisma.organization.findFirst();
  if (!org) {
    console.error('No organization found. Please login/create org first.');
    return;
  }
  console.log(`Using organization: ${org.name} (${org.id})`);

  // 2. Define Seed Data
  const seedData = [
    {
      deptCode: 'IT',
      deptName: 'Information Technology',
      divisions: [
        {
          id: 'div-it-support',
          name: 'IT Support',
          ext: '101',
          employees: [
            { nik: 'IT001', nama: 'Budi Santoso', jabatan: 'Staff' },
            { nik: 'IT002', nama: 'Siti Aminah', jabatan: 'Supervisor' },
            { nik: 'IT003', nama: 'Joko Anwar', jabatan: 'Manager' },
          ],
        },
      ],
    },
    {
      deptCode: 'BS',
      deptName: 'Building Service',
      divisions: [
        {
          id: 'div-bs-hk',
          name: 'Housekeeping',
          ext: '201',
          employees: [
            { nik: 'BS001', nama: 'Andi Wijaya', jabatan: 'Staff' },
            { nik: 'BS002', nama: 'Rina Maryana', jabatan: 'Supervisor' },
          ],
        },
        {
          id: 'div-bs-sec',
          name: 'Security',
          ext: '202',
          employees: [
            { nik: 'BS003', nama: 'Slamet Riyadi', jabatan: 'Security Guard' },
            { nik: 'BS004', nama: 'Bambang Heru', jabatan: 'Chief Security' },
          ],
        },
      ],
    },
    {
      deptCode: 'HRD',
      deptName: 'Human Resources Development',
      divisions: [
        {
          id: 'div-hr-rec',
          name: 'Recruitment',
          ext: '301',
          employees: [
            { nik: 'HR001', nama: 'Maya Kartika', jabatan: 'HR Officer' },
          ],
        },
        {
          id: 'div-hr-pay',
          name: 'Payroll',
          ext: '302',
          employees: [
            { nik: 'HR002', nama: 'Dedi Kurniawan', jabatan: 'Payroll Specialist' },
          ],
        },
      ],
    },
    {
      deptCode: 'ENG',
      deptName: 'Engineering',
      divisions: [
        {
          id: 'div-eng-maint',
          name: 'Maintenance',
          ext: '401',
          employees: [
            { nik: 'EN001', nama: 'Taufik Hidayat', jabatan: 'Technician' },
            { nik: 'EN002', nama: 'Agus Setiawan', jabatan: 'Civil Engineer' },
          ],
        },
        {
          id: 'div-eng-elec',
          name: 'Electrical',
          ext: '402',
          employees: [
            { nik: 'EN003', nama: 'Hendra Saputra', jabatan: 'Electrician' },
          ],
        },
      ],
    },
  ];

  // 3. Process Seed Data
  for (const deptData of seedData) {
    // Upsert Department
    let dept = await prisma.department.findFirst({
      where: { organization_id: org.id, kode_department: deptData.deptCode },
    });

    if (!dept) {
      console.log(`Creating department: ${deptData.deptName}...`);
      dept = await prisma.department.create({
        data: {
          organization_id: org.id,
          kode_department: deptData.deptCode,
          nama_department: deptData.deptName,
          id_hod: 'temp-hod',
        },
      });
    } else {
      console.log(`Department exists: ${deptData.deptName}`);
    }

    for (const divData of deptData.divisions) {
      // Upsert Divisi
      const divisi = await prisma.divisi.upsert({
        where: {
          id_divisi: divData.id,
        },
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
      console.log(`  Divisi verified: ${divisi.nama_divisi}`);

      for (const emp of divData.employees) {
        const exists = await prisma.karyawan.findFirst({
          where: { organization_id: org.id, nik: emp.nik },
        });

        if (!exists) {
          await prisma.karyawan.create({
            data: {
              organization_id: org.id,
              divisi_id: divisi.id_divisi,
              department_id: dept.id_department,
              nik: emp.nik,
              nama: emp.nama,
              nama_alias: emp.nama.split(' ')[0],
              alamat: 'Jl. Merdeka No. 1',
              no_ktp: `3201${Math.floor(Math.random() * 1000000000000)}`,
              telp: '08123456789',
              jabatan: emp.jabatan,
              status_karyawan: 'Aktif',
              call_sign: emp.nik,
              keterangan: 'Seeded via script',
            },
          });
          console.log(`    Created employee: ${emp.nama} (${emp.nik})`);
        } else {
          console.log(`    Employee exists: ${emp.nama} (${emp.nik})`);
        }
      }
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
