"use server";

import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { revalidatePath } from "next/cache";

export type EntityType =
  | "REQUISITION"
  | "ASSET_DISPOSAL"
  | "ASSET_LOAN"
  | "STOCK_TRANSFER";

/**
 * Initiates an approval workflow for a given entity.
 */
export async function initiateApproval(
  entityType: EntityType,
  entityId: string,
) {
  const { organizationId, userId } = await getActiveOrganizationWithRole();

  if (!userId) throw new Error("Unauthorized");

  // Find the active template for this entity type
  const template = await (prisma as any).approvalTemplate.findFirst({
    where: {
      organizationId,
      entityType,
      isActive: true,
    },
    include: {
      steps: {
        orderBy: { stepNumber: "asc" },
      },
    },
  });

  // If no template exists, we assume auto-approve or that no workflow is required.
  if (!template || template.steps.length === 0) {
    return { status: "AUTO_APPROVED" };
  }

  // Check if an existing request exists
  const existing = await (prisma as any).approvalRequest.findFirst({
    where: { organizationId, entityId, entityType },
  });

  if (existing) {
    throw new Error("Approval workflow already initiated for this item.");
  }

  // Create the request starting at step 1
  const request = await (prisma as any).approvalRequest.create({
    data: {
      organizationId,
      entityId,
      entityType,
      requesterId: userId,
      status: "PENDING",
      currentStepNum: 1,
    },
  });

  // TODO: Send notification to the person responsible for Step 1
  // const firstStep = template.steps[0];
  // notifyApprover(firstStep, request);

  return { status: "PENDING", requestId: request.id };
}

/**
 * Process (Approve/Reject) a pending approval request
 */
export async function processApproval(
  requestId: string,
  action: "APPROVE" | "REJECT",
  comments?: string,
) {
  const { organizationId, userId } = await getActiveOrganizationWithRole();

  if (!userId) throw new Error("Unauthorized");

  const request = await (prisma as any).approvalRequest.findUnique({
    where: { id: requestId, organizationId },
  });

  if (!request) throw new Error("Approval request not found");
  if (request.status !== "PENDING")
    throw new Error(`Request is already ${request.status}`);

  // Log the action
  await (prisma as any).approvalLog.create({
    data: {
      approvalRequestId: request.id,
      stepNumber: request.currentStepNum,
      approverId: userId,
      action: action,
      comments: comments || null,
    },
  });

  if (action === "REJECT") {
    // If rejected, the whole workflow fails
    await (prisma as any).approvalRequest.update({
      where: { id: request.id },
      data: { status: "REJECTED" },
    });

    await handleWorkflowCompletion(
      request.entityType,
      request.entityId,
      "REJECTED",
    );
    return { success: true, status: "REJECTED" };
  }

  // If APPROVED, check if there are more steps
  const template = await (prisma as any).approvalTemplate.findFirst({
    where: { organizationId, entityType: request.entityType, isActive: true },
    include: { steps: { orderBy: { stepNumber: "asc" } } },
  });

  if (!template) throw new Error("Approval Template missing during processing");

  const maxStep = template.steps[template.steps.length - 1].stepNumber;

  if (request.currentStepNum >= maxStep) {
    // Fully approved!
    await (prisma as any).approvalRequest.update({
      where: { id: request.id },
      data: { status: "APPROVED" },
    });

    await handleWorkflowCompletion(
      request.entityType,
      request.entityId,
      "APPROVED",
    );
    return { success: true, status: "APPROVED" };
  } else {
    // Advance to next step
    await (prisma as any).approvalRequest.update({
      where: { id: request.id },
      data: { currentStepNum: request.currentStepNum + 1 },
    });
    // TODO: Notify next approver
    return { success: true, status: "PENDING_NEXT_STEP" };
  }
}

/**
 * Sync the finalized status back to the original entity
 */
async function handleWorkflowCompletion(
  entityType: string,
  entityId: string,
  finalStatus: "APPROVED" | "REJECTED",
) {
  // We apply the final state to the specific entity
  if (entityType === "ASSET_DISPOSAL") {
    await prisma.assetDisposal.update({
      where: { id: entityId },
      data: { status: finalStatus === "APPROVED" ? "APPROVED" : "REJECTED" },
    });
  } else if (entityType === "REQUISITION") {
    await prisma.requisition.update({
      where: { id: entityId },
      data: { status: finalStatus === "APPROVED" ? "COMPLETED" : "REJECTED" },
    });
  }
}

/**
 * Gets all pending approvals that need the current user's attention
 */
export async function getPendingApprovalsForUser() {
  const { organizationId, userId } = await getActiveOrganizationWithRole();
  if (!userId) return [];

  // TODO: We need to filter by roles/hierarchy. For now, returning all pending logic for demo.
  return (prisma as any).approvalRequest.findMany({
    where: {
      organizationId,
      status: "PENDING",
    },
    include: {
      requester: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
