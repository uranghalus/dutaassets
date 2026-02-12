"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { stockTransferFormSchema } from "@/schema/stock-transfer-schema";
import { withContext } from "@/lib/action-utils";

export async function getStockTransfers({
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
    prisma.stockTransfer.findMany({
      where: { organizationId },
      include: {
        fromWarehouse: true,
        toWarehouse: true,
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
    prisma.stockTransfer.count({
      where: { organizationId },
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createStockTransfer(formData: FormData) {
  return withContext(async () => {
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
      fromWarehouseId: formData.get("fromWarehouseId"),
      toWarehouseId: formData.get("toWarehouseId"),
      remarks: formData.get("remarks"),
      items: parsedItems,
    };

    const validatedFields = stockTransferFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { fromWarehouseId, toWarehouseId, remarks, items } = validatedFields.data;

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Create StockTransfer Header
        const transfer = await tx.stockTransfer.create({
          data: {
            organizationId,
            fromWarehouseId,
            toWarehouseId,
            remarks,
            status: "COMPLETED",
          },
        });

        // 2. Process Items
        for (const item of items) {
          // a. Create Transfer Detail Record
          await tx.stockTransferItem.create({
            data: {
              stockTransferId: transfer.id,
              itemId: item.itemId,
              quantity: item.quantity,
            },
          });

          // b. Deduct from Source Warehouse
          const sourceStock = await tx.stock.findUnique({
            where: {
              warehouseId_itemId: {
                warehouseId: fromWarehouseId,
                itemId: item.itemId,
              },
            },
          });

          if (!sourceStock || sourceStock.quantity < item.quantity) {
            throw new Error(`Insufficient stock for item ID ${item.itemId} in source warehouse`);
          }

          await tx.stock.update({
            where: { id: sourceStock.id },
            data: {
              quantity: { decrement: item.quantity },
            },
          });

          // c. Add to Destination Warehouse
          await tx.stock.upsert({
            where: {
              warehouseId_itemId: {
                warehouseId: toWarehouseId,
                itemId: item.itemId,
              },
            },
            update: {
              quantity: { increment: item.quantity },
            },
            create: {
              warehouseId: toWarehouseId,
              itemId: item.itemId,
              quantity: item.quantity,
            },
          });
        }
      });

      revalidatePath("/inventory/transfers");
      revalidatePath("/inventory/stocks");

      return { success: true };
    } catch (error) {
      console.error("Failed to create stock transfer:", error);
      return { error: error instanceof Error ? error.message : "Failed to create transfer" };
    }
  });
}
