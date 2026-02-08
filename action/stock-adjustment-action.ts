"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache"; 
import { stockAdjustmentFormSchema } from "@/schema/stock-adjustment-schema";

export async function getStockAdjustments({
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
    prisma.stockAdjustment.findMany({
      where: { organizationId },
      include: {
        warehouse: true,
        items: {
            include: {
                item: true
            }
        },
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.stockAdjustment.count({
      where: { organizationId },
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createStockAdjustment(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    throw new Error("No active organization");
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
    reason: formData.get("reason"),
    reference: formData.get("reference"),
    items: parsedItems,
  };

  const validatedFields = stockAdjustmentFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { warehouseId, reason, reference, items } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create Header
      const adjustment = await tx.stockAdjustment.create({
        data: {
          organizationId,
          warehouseId,
          reason,
          reference,
          status: "COMPLETED",
        },
      });

      // 2. Process Items
      for (const item of items) {
        // Get current stock
        let currentStock = 0;
        const stockRecord = await tx.stock.findUnique({
          where: {
            warehouseId_itemId: {
              warehouseId,
              itemId: item.itemId,
            },
          },
        });

        if (stockRecord) {
          currentStock = stockRecord.quantity;
        }

        // Create Detail Record
        await tx.stockAdjustmentItem.create({
          data: {
            stockAdjustmentId: adjustment.id,
            itemId: item.itemId,
            quantityChange: item.quantityChange,
            currentStock: currentStock,
            remarks: item.remarks,
          },
        });

        // Update Actual Stock
        await tx.stock.upsert({
          where: {
            warehouseId_itemId: {
              warehouseId,
              itemId: item.itemId,
            },
          },
          update: {
            quantity: { increment: item.quantityChange },
          },
          create: {
            warehouseId,
            itemId: item.itemId,
            quantity: item.quantityChange,
          },
        });
      }
    });

    revalidatePath("/inventory/adjustments");
    revalidatePath("/inventory/stocks");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create stock adjustment:", error);
    return { error: "Failed to create adjustment" };
  }
}
