
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up orphan records...');

  // 1. Clean orphans in Department (organization_id)
  const orphanDepartments = await prisma.department.findMany({
    where: {
      organization: null
    },
    select: { id_department: true }
  });

  if (orphanDepartments.length > 0) {
    console.log(`Found ${orphanDepartments.length} orphan departments. Deleting...`);
    await prisma.department.deleteMany({
      where: {
        id_department: {
          in: orphanDepartments.map(d => d.id_department)
        }
      }
    }); 
  } else {
    console.log('No orphan departments found.');
  }

  // 2. Clean orphans in Divisi (organization_id)
  const orphanDivisiOrg = await prisma.divisi.findMany({
    where: {
        organization: null
    },
    select: { id_divisi: true }
  });

    if (orphanDivisiOrg.length > 0) {
    console.log(`Found ${orphanDivisiOrg.length} orphan divisions (invalid org). Deleting...`);
    await prisma.divisi.deleteMany({
      where: {
        id_divisi: {
          in: orphanDivisiOrg.map(d => d.id_divisi)
        }
      }
    }); 
  } else {
    console.log('No orphan divisions (org) found.');
  }
  
  // 3. Clean orphans in Divisi (department_id)
    const orphanDivisiDept = await prisma.divisi.findMany({
    where: {
        department: null
    },
    select: { id_divisi: true }
  });

    if (orphanDivisiDept.length > 0) {
    console.log(`Found ${orphanDivisiDept.length} orphan divisions (invalid dept). Deleting...`);
    await prisma.divisi.deleteMany({
      where: {
        id_divisi: {
          in: orphanDivisiDept.map(d => d.id_divisi)
        }
      }
    }); 
  } else {
    console.log('No orphan divisions (dept) found.');
  }

  console.log('Cleanup complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
