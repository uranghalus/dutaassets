
import { prisma } from '../lib/prisma';
import { auth } from '../lib/auth';

async function main() {
  console.log('Seeding employees...');

  // 1. Get Org & Dept
  const org = await prisma.organization.findFirst();
  if (!org) {
    console.error('No organization found. Please login/create org first.');
    return;
  }
  let dept = await prisma.department.findFirst({
    where: { organization_id: org.id }
  });
  
  if (!dept) {
     console.log('Creating mock department...');
     dept = await prisma.department.create({
         data: {
             organization_id: org.id,
             kode_department: 'IT',
             nama_department: 'Information Technology',
             id_hod: 'temp-hod'
         }
     })
  }

  // 2. Create Divisi
  const divisi = await prisma.divisi.upsert({
    where: {
        // Composite unique key workaround or just findFirst
        // Schema: @@index([organization_id, department_id])
        // There is no unique constraint strictly on name per org unless application enforced.
        // Actually Schema has: @@index([organization_id, department_id])
        // So we just create if not exists
        id_divisi: "mock-div-1"
    },
    update: {},
    create: {
        organization_id: org.id,
        department_id: dept.id_department,
        nama_divisi: 'IT Support',
        ext_tlp: '101'
    }
  });

  console.log('Divisi verified:', divisi.nama_divisi);

  // 3. Create Employees
  const employees = [
    { nik: 'EMP001', nama: 'Budi Santoso', jabatan: 'Staff' },
    { nik: 'EMP002', nama: 'Siti Aminah', jabatan: 'Supervisor' },
    { nik: 'EMP003', nama: 'Joko Anwar', jabatan: 'Manager', linkUser: true },
  ];

  for (const emp of employees) {
      const exists = await prisma.karyawan.findFirst({
          where: { organization_id: org.id, nik: emp.nik }
      });

      if (!exists) {
          const newEmp = await prisma.karyawan.create({
              data: {
                  organization_id: org.id,
                  divisi_id: divisi.id_divisi,
                  nik: emp.nik,
                  nama: emp.nama,
                  nama_alias: emp.nama.split(' ')[0],
                  alamat: 'Jl. Merdeka No. 1',
                  no_ktp: `3201${Math.floor(Math.random() * 1000000000000)}`,
                  telp: '08123456789',
                  jabatan: emp.jabatan,
                  status_karyawan: 'Aktif',
                  call_sign: emp.nik,
                  keterangan: 'Seeded via script'
              }
          });
          console.log(`Created employee: ${emp.nama}`);
      } else {
          console.log(`Employee exists: ${emp.nama}`);
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
