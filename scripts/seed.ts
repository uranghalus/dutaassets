/* eslint-disable no-console */
import "dotenv/config";

import { seedDepartment } from "./seed-department";
import { seedRoles } from "./seed-roles";
import { seedAdminAndOrganization } from "./seed-admin";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Running MASTER SEEDER...\n");

  if (process.env.NODE_ENV === "production") {
    console.warn("⚠ WARNING: Seeder running in production");
  }

  await seedAdminAndOrganization(prisma);
  await seedDepartment(prisma);
  await seedRoles(prisma);

  console.log("\n🎉 ALL SEEDERS COMPLETED SUCCESSFULLY");
}

main()
  .catch((e) => {
    console.error("❌ Seeder failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
