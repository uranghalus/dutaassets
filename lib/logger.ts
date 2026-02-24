import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { getClientIp } from "./ip-utils";

export type LogData = {
  organizationId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
};

/**
 * Global helper to record activity logs.
 * Can be used within an existing Prisma transaction or standalone.
 */
export async function logActivity(data: LogData, tx?: Prisma.TransactionClient) {
  const client = tx || prisma;
  const headerList = await headers();
  
  const ipAddress = getClientIp(headerList);
  const userAgent = headerList.get("user-agent") || "unknown";

  try {
    return await client.activityLog.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details as Prisma.InputJsonValue,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // We don't want to crash the main transaction if logging fails,
    // but we should at least log it to stderr for debugging.
    console.error("Failed to record activity log:", error);
  }
}
