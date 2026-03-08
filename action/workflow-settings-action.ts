"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "@/action/organization-action";
import { revalidatePath } from "next/cache";

export async function getApprovalTemplates() {
  const { organizationId } = await getActiveOrganizationWithRole();
  return prisma.approvalTemplate.findMany({
    where: { organizationId },
    include: {
      steps: {
        orderBy: { stepNumber: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createApprovalTemplate(data: {
  name: string;
  entityType: string;
  steps: { stepNumber: number; targetRole?: string; targetJabatan?: string }[];
}) {
  const { organizationId, role } = await getActiveOrganizationWithRole();
  if (!["owner", "superadmin", "admin"].includes(role)) {
    throw new Error("Unauthorized to create templates");
  }

  const template = await prisma.approvalTemplate.create({
    data: {
      organizationId,
      name: data.name,
      entityType: data.entityType,
      steps: {
        create: data.steps.map((step) => ({
          stepNumber: step.stepNumber,
          targetRole: step.targetRole || null,
          targetJabatan: step.targetJabatan || null,
        })),
      },
    },
  });

  revalidatePath("/settings");
  return template;
}

export async function toggleTemplateStatus(id: string, isActive: boolean) {
  const { organizationId, role } = await getActiveOrganizationWithRole();
  if (!["owner", "superadmin", "admin"].includes(role)) {
    throw new Error("Unauthorized");
  }

  await prisma.approvalTemplate.update({
    where: { id, organizationId },
    data: { isActive },
  });

  revalidatePath("/settings");
}

export async function deleteApprovalTemplate(id: string) {
  const { organizationId, role } = await getActiveOrganizationWithRole();
  if (!["owner", "superadmin", "admin"].includes(role)) {
    throw new Error("Unauthorized");
  }

  await prisma.approvalTemplate.delete({
    where: { id, organizationId },
  });

  revalidatePath("/settings");
}
