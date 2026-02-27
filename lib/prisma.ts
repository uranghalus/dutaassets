import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import { auditExtension } from "./prisma-audit";

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT),

    ssl: {
      ca: process.env.DATABASE_CA_CERT,
      rejectUnauthorized: true,
    },

    connectionLimit: 1, // 🔥 PENTING
    connectTimeout: 10000,
  });

  return new PrismaClient({ adapter }).$extends(auditExtension);
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
