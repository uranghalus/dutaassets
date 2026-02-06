
import 'dotenv/config';
import mysql from 'mysql2/promise';

async function main() {
  console.log('Connecting to database...');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  // Parse DATABASE_URL (mysql://user:pass@host:port/db)
  // mysql2 creates connection from URL string directly
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('Connected. Cleaning up orphans...');

  try {
    // 1. Delete orphan Departments
    const [deptResult] = await connection.execute(
      'DELETE FROM Department WHERE organization_id NOT IN (SELECT id FROM organization)'
    );
    // @ts-ignore
    console.log(`Deleted orphan Departments: ${deptResult.affectedRows}`);

    // 2. Delete orphan Divisi (invalid org)
    const [divResult1] = await connection.execute(
      'DELETE FROM Divisi WHERE organization_id NOT IN (SELECT id FROM organization)'
    );
    // @ts-ignore
    console.log(`Deleted orphan Divisi (invalid org): ${divResult1.affectedRows}`);

    // 3. Delete orphan Divisi (invalid dept)
    // Note: If we just deleted departments, some divisi might now point to non-existent departments
    // So we should clean them up too.
    const [divResult2] = await connection.execute(
      'DELETE FROM Divisi WHERE department_id NOT IN (SELECT id_department FROM Department)'
    );
    // @ts-ignore
    console.log(`Deleted orphan Divisi (invalid dept): ${divResult2.affectedRows}`);

    console.log('Cleanup complete.');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await connection.end();
  }
}

main();
