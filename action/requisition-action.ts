"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { withContext } from "@/lib/action-utils";
import { requisitionFormSchema } from "@/schema/requisition-schema";

export async function getRequisitions({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    return { data: [], pageCount: 0 };
  }

  const [data, total] = await Promise.all([
    prisma.requisition.findMany({
      where: { organizationId },
      include: {
        requester: true,
        warehouse: true,
        items: {
          include: {
            item: true,
          },
        },
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.requisition.count({
      where: { organizationId },
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createRequisition(formData: FormData) {
  return withContext(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const organizationId = session.session.activeOrganizationId;
    const userId = session.user.id;

    if (!organizationId) {
      throw new Error("No active organization");
    }

    // Find linked employee (karyawan) for the user
    const employee = await prisma.karyawan.findUnique({
      where: { userId },
    });

    if (!employee) {
      return { error: "User is not linked to an employee record" };
    }

    // Parse items from JSON string
    const itemsJson = formData.get("items") as string;
    let parsedItems = [];
    try {
      parsedItems = JSON.parse(itemsJson);
    } catch (error) {
      return { error: "Invalid items data" };
    }

    const rawData = {
      warehouseId: formData.get("warehouseId"),
      remarks: formData.get("remarks"),
      items: parsedItems,
    };

    const validatedFields = requisitionFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { warehouseId, remarks, items } = validatedFields.data;

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Create Header
        const requisition = await tx.requisition.create({
          data: {
            organizationId,
            requesterId: employee.id_karyawan,
            warehouseId: warehouseId || undefined,
            remarks,
            status: "PENDING_SUPERVISOR",
          },
        });

        // 2. Create Items
        for (const item of items) {
          await tx.requisitionItem.create({
            data: {
              requisitionId: requisition.id,
              itemId: item.itemId,
              quantity: item.quantity,
            },
          });
        }
      });

      revalidatePath("/inventory/requisitions");
      return { success: true };
    } catch (error) {
      console.error("Failed to create requisition:", error);
      return { error: "Failed to create requisition" };
    }
  });
}

export async function getPaginatedApprovalRequisitions({
  page = 1,
  pageSize = 10,
  search = "",
  status = "PENDING_SUPERVISOR", // Default as per requirement (or the first logical pending state)
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  return withContext(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) return { data: [], total: 0, pageCount: 0 };

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const skip = (safePage - 1) * safePageSize;

    const where: any = {
      organizationId,
      status: status === "PENDING_APPROVAL" ? { in: ["PENDING_SUPERVISOR", "PENDING_FA", "PENDING_GM"] } : status,
      OR: search
        ? [
            { id: { contains: search } },
            {
              requester: {
                nama: { contains: search },
              },
            },
          ]
        : undefined,
    };

    const [data, total] = await Promise.all([
      prisma.requisition.findMany({
        where,
        include: {
          requester: true,
          warehouse: true,
          _count: {
            select: { items: true },
          },
        },
        skip,
        take: safePageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.requisition.count({ where }),
    ]);

    return {
      data,
      total,
      pageCount: Math.ceil(total / safePageSize),
      page: safePage,
      pageSize: safePageSize,
    };
  });
}

export async function approveRequisition(id: string, nextStatus: any) {
  return updateRequisitionStatus(id, nextStatus);
}

export async function rejectRequisition(id: string) {
  return updateRequisitionStatus(id, "REJECTED");
}

export async function updateRequisitionStatus(
  id: string,
  status: "PENDING_FA" | "PENDING_GM" | "PENDING_WAREHOUSE" | "COMPLETED" | "REJECTED",
  warehouseId?: string
) {
  return withContext(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const userName = session.user.name; // OR fetch employee name? Using Name for now.

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      throw new Error("No active organization");
    }

    try {
      const requisition = await prisma.requisition.findUnique({
        where: { id, organizationId },
        include: { items: true },
      });

      if (!requisition) {
        return { error: "Requisition not found" };
      }

      // Find linked employee for audit trail name
      const employee = await prisma.karyawan.findUnique({ where: { userId } });
      const approverName = employee?.nama || userName || "Unknown";

      await prisma.$transaction(async (tx) => {
        // Update warehouse if provided
        if (warehouseId) {
          await tx.requisition.update({
            where: { id },
            data: { warehouseId }
          });
        }

        // Refetch to get latest warehouseId if updated
        const currentRequisition = warehouseId ? { ...requisition, warehouseId } : requisition;
        const finalWarehouseId = currentRequisition.warehouseId;

        // Logic for Status Transitions and Audit
        let updateData: any = { status };

        if (status === "PENDING_FA") {
          // Supervisor Acknowledged
          updateData.supervisorAckBy = approverName;
          updateData.supervisorAckAt = new Date();
        } else if (status === "PENDING_GM") {
          // FA Acknowledged
          updateData.faManagerAckBy = approverName;
          updateData.faManagerAckAt = new Date();
        } else if (status === "PENDING_WAREHOUSE") {
          // GM Approved
          updateData.gmApprovedBy = approverName;
          updateData.gmApprovedAt = new Date();
        } else if (status === "COMPLETED") {
          // Warehouse Fulfilled

          if (!finalWarehouseId) {
            throw new Error("Warehouse must be selected to complete requisition");
          }

          for (const item of requisition.items) {
            // Find stock
            const stock = await tx.stock.findUnique({
              where: {
                warehouseId_itemId: {
                  warehouseId: finalWarehouseId,
                  itemId: item.itemId
                }
              }
            });

            if (!stock) {
              // Create stock record if not exists
              await tx.stock.create({
                data: {
                  warehouseId: finalWarehouseId,
                  itemId: item.itemId,
                  quantity: -item.quantity
                }
              });
            } else {
              await tx.stock.update({
                where: { id: stock.id },
                data: {
                  quantity: { decrement: item.quantity }
                }
              });
            }
          }
        }

        await tx.requisition.update({
          where: { id },
          data: updateData,
        });
      });

      revalidatePath("/inventory/requisitions");
      revalidatePath("/inventory/requisition/approval");
      return { success: true };
    } catch (error) {
      console.error("Failed to update requisition:", error);
      return { error: error instanceof Error ? error.message : "Failed to update requisition" };
    }
  });
}
