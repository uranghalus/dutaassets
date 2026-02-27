import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import { auditExtension } from "./prisma-audit";
import path from "node:path";
import fs from "fs";

const caCertPath = path.resolve(process.cwd(), "config/ca_cert.pem");
const caCert = fs.readFileSync(caCertPath, "utf-8");
const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT),
    ssl: {
      cert: caCert,
      rejectUnauthorized: false,
    },
    // connectionLimit: 5,
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
