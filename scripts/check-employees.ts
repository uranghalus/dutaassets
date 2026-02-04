import { prisma } from "@/lib/prisma";


async function main() {
  const count = await prisma.karyawan.count();
  console.log('Employee count:', count);
  const users = await prisma.user.count();
  console.log('User count:', users);
  
  const orgs = await prisma.organization.count();
  console.log('Organization count:', orgs);
  const depts = await prisma.department.count();
  console.log('Department count:', depts);
  const divisis = await prisma.divisi.count();
  console.log('Divisi count:', divisis);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
