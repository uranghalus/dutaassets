"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
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
}

export async function updateRequisitionStatus(
  id: string,
  // Status can be the NEXT status or REJECTED.
  // Ideally we infer the next status from current status if the action is "APPROVE", 
  // but keeping it explicit allows flexibility.
  // Actually, let's allow passing "NEXT_STEP" or specific status.
  // For simplicity matching UI, I'll accept specific status strings.
  status: "PENDING_FA" | "PENDING_GM" | "PENDING_WAREHOUSE" | "COMPLETED" | "REJECTED",
  warehouseId?: string
) {
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
    const employee = await prisma.karyawan.findUnique({ where: { userId }});
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
    return { success: true };
  } catch (error) {
    console.error("Failed to update requisition:", error);
    return { error: error instanceof Error ? error.message : "Failed to update requisition" };
  }
}
