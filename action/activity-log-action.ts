"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getActivityLogs({
  page = 0,
  pageSize = 10,
  entityId,
  entityType,
}: {
  page?: number;
  pageSize?: number;
  entityId?: string;
  entityType?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  let organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    const employee = await prisma.karyawan.findUnique({
      where: { userId: session.user.id },
      select: { organization_id: true },
    });
    organizationId = employee?.organization_id || null;
  }

  if (!organizationId) {
    return { data: [], pageCount: 0 };
  }

  const where = {
    organizationId,
    entityId: entityId || undefined,
    entityType: entityType || undefined,
  };

  const [data, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        user: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.activityLog.count({
      where,
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}
