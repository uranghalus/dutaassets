"use server";

import { prisma } from "@/lib/prisma";
import { $Enums } from "@/generated/prisma/client";
import { getActiveOrganizationWithRole } from "./organization-action";

export type AppNotification = {
  id: string;
  type:
    | "REQUISITION_PENDING"
    | "TRANSFER_PENDING"
    | "DISPOSAL_PENDING"
    | "MAINTENANCE_DUE";
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
    title: "Pending Requisition",
    message: `${r.requester?.nama ?? "Someone"} requested items awaiting your approval.`,
    date: r.createdAt,
    url: "/inventory/requisition/approval",
  }));

  // Also fetch pending Asset Transfers if the user is admin/owner
  const { role } = await getActiveOrganizationWithRole();
  if (["admin", "owner"].includes(role)) {
    const pendingTransfers = await prisma.assetTransfer.findMany({
      where: {
        organizationId,
        status: "PENDING",
      },
      select: {
        id: true,
        createdAt: true,
        asset: {
          select: { nama_asset: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const transferNotifs: AppNotification[] = pendingTransfers.map((t) => ({
      id: t.id,
      type: "TRANSFER_PENDING",
      title: "Pending Transfer",
      message: `Transfer requested for asset "${t.asset?.nama_asset ?? "Unknown"}" needs approval.`,
      date: t.createdAt,
      url: "/asset-transfers",
    }));

    notifications.push(...transferNotifs);
    console.log("AVAILABLE PRISMA MODELS:", Object.keys(prisma));
    const pendingDisposals = await prisma.assetDisposal.findMany({
      where: {
        organizationId,
        status: "PENDING_APPROVAL",
      },
      select: {
        id: true,
        createdAt: true,
        asset: {
          select: { nama_asset: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const disposalNotifs: AppNotification[] = pendingDisposals.map((d) => ({
      id: d.id,
      type: "DISPOSAL_PENDING",
      title: "Pending Disposal",
      message: `Disposal requested for asset "${d.asset?.nama_asset ?? "Unknown"}" needs approval.`,
      date: d.createdAt,
      url: "/assets/disposals",
    }));

    notifications.push(...disposalNotifs);

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const dueSchedules = await prisma.assetMaintenanceSchedule.findMany({
      where: {
        organizationId,
        isActive: true,
        nextDueDate: {
          lte: threeDaysFromNow,
        },
      },
      select: {
        id: true,
        nextDueDate: true,
        title: true,
        asset: {
          select: { nama_asset: true },
        },
      },
      orderBy: { nextDueDate: "asc" },
      take: 5,
    });

    const maintenanceNotifs: AppNotification[] = dueSchedules.map((s) => ({
      id: s.id,
      type: "MAINTENANCE_DUE",
      title: "Maintenance Due",
      message: `Asset "${s.asset?.nama_asset ?? "Unknown"}" is due for maintenance: ${s.title}.`,
      date: s.nextDueDate,
      url: "/assets/schedules",
    }));

    notifications.push(...maintenanceNotifs);
  }

  // Sort combined notifications by date descending
  notifications.sort((a, b) => b.date.getTime() - a.date.getTime());

  return notifications;
}
