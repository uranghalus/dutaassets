"use server";

import { prisma } from "@/lib/prisma";
import { $Enums } from "@/generated/prisma/client";
import { getActiveOrganizationWithRole } from "./organization-action";

export type AppNotification = {
  id: string;
  type: "REQUISITION_PENDING";
  title: string;
  message: string;
  date: Date;
  url: string;
};

export async function getPendingNotifications() {
  const { organizationId, userId } = await getActiveOrganizationWithRole();

  // Find employee position
  const employee = await prisma.karyawan.findUnique({
    where: { userId },
    select: { jabatan: true },
  });

  const jabatan = employee?.jabatan?.toLowerCase() || "";

  // Map position to pending status
  let statusFilter: $Enums.RequisitionStatus[] = [];

  if (jabatan.includes("supervisor")) statusFilter = ["PENDING_SUPERVISOR"];
  else if (jabatan.includes("fa manager") || jabatan.includes("finance"))
    statusFilter = ["PENDING_FA"];
  else if (jabatan.includes("gm") || jabatan.includes("general manager"))
    statusFilter = ["PENDING_GM"];
  else if (jabatan.includes("admin") || jabatan.includes("warehouse"))
    statusFilter = ["PENDING_WAREHOUSE"];

  if (statusFilter.length === 0) return [];

  const pendingRequisitions = await prisma.requisition.findMany({
    where: {
      organizationId,
      status: { in: statusFilter },
    },
    select: {
      id: true,
      createdAt: true,
      requester: {
        select: { nama: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const notifications: AppNotification[] = pendingRequisitions.map((r) => ({
    id: r.id,
    type: "REQUISITION_PENDING",
    title: "Pending Approval",
    message: `${r.requester?.nama ?? "Someone"} requested items.`,
    date: r.createdAt,
    url: "/inventory/requisition/approval",
  }));

  return notifications;
}
