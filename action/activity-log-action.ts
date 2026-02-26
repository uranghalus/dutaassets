"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getActivityLogs({
  page = 0,
  pageSize = 10,
  entityId,
  entityType,
  action,
  model,
  dateFrom,
  dateTo,
}: {
  page?: number;
  pageSize?: number;
  entityId?: string;
  entityType?: string;
  action?: string;
  model?: string;
  dateFrom?: string;
  dateTo?: string;
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

  const where: Record<string, unknown> = {
    organizationId,
    recordId: entityId || undefined,
    model: model || entityType || undefined,
    action: action || undefined,
  };

  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({
      where,
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function getAuditLogFilterOptions() {
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
    return { actions: [], models: [] };
  }

  const [actions, models] = await Promise.all([
    prisma.auditLog.findMany({
      where: { organizationId },
      select: { action: true },
      distinct: ["action"],
      orderBy: { action: "asc" },
    }),
    prisma.auditLog.findMany({
      where: { organizationId },
      select: { model: true },
      distinct: ["model"],
      orderBy: { model: "asc" },
    }),
  ]);

  return {
    actions: actions.map((a) => a.action),
    models: models.map((m) => m.model),
  };
}
