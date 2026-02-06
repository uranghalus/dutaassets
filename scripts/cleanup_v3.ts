
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

async function main() {
  console.log('Initializing Prisma - Cleanup Script...');

  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
  });

  const prisma = new PrismaClient({ adapter });

  console.log('Cleaning up orphan records using Raw SQL...');

  try {
    // 1. Delete orphan Departments
    const deptCount = await prisma.$executeRawUnsafe(`
      DELETE FROM Department 
      WHERE organization_id NOT IN (SELECT id FROM organization)
    `);
    console.log(`Deleted orphan Departments: ${deptCount}`);

    // 2. Delete orphan Divisi (invalid org)
    const divOrgCount = await prisma.$executeRawUnsafe(`
      DELETE FROM Divisi 
      WHERE organization_id NOT IN (SELECT id FROM organization)
    `);
    console.log(`Deleted orphan Divisi (invalid org): ${divOrgCount}`);

    // 3. Delete orphan Divisi (invalid dept)
    const divDeptCount = await prisma.$executeRawUnsafe(`
      DELETE FROM Divisi 
      WHERE department_id NOT IN (SELECT id_department FROM Department)
    `);
    console.log(`Deleted orphan Divisi (invalid dept): ${divDeptCount}`);

    console.log('Cleanup complete.');
  } catch (error) {
    console.error('Detailed Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
