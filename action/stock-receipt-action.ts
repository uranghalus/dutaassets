"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { stockReceiptFormSchema } from "@/schema/stock-receipt-schema";
import { withContext } from "@/lib/action-utils";

export async function getStockReceipts({
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
    prisma.stockReceipt.findMany({
      where: { organizationId },
      include: {
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
    prisma.stockReceipt.count({
      where: { organizationId },
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createStockReceipt(formData: FormData) {
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
      warehouseId: formData.get("warehouseId"),
      vendorName: formData.get("vendorName"),
      referenceNumber: formData.get("referenceNumber"),
      remarks: formData.get("remarks"),
      items: parsedItems,
    };

    const validatedFields = stockReceiptFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { warehouseId, vendorName, referenceNumber, remarks, items } = validatedFields.data;

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Create StockReceipt Header
        const receipt = await tx.stockReceipt.create({
          data: {
            organizationId,
            warehouseId,
            vendorName,
            referenceNumber,
            remarks,
          },
        });

        // 2. Process Items
        for (const item of items) {
          // a. Create Receipt Detail Record
          await tx.stockReceiptItem.create({
            data: {
              stockReceiptId: receipt.id,
              itemId: item.itemId,
              quantity: item.quantity,
            },
          });

          // b. Add to Stock (Upsert)
          await tx.stock.upsert({
            where: {
              warehouseId_itemId: {
                warehouseId: warehouseId,
                itemId: item.itemId,
              },
            },
            update: {
              quantity: { increment: item.quantity },
            },
            create: {
              warehouseId: warehouseId,
              itemId: item.itemId,
              quantity: item.quantity,
            },
          });
        }
      });

      revalidatePath("/inventory/receipts");
      revalidatePath("/inventory/stocks");

      return { success: true };
    } catch (error) {
      console.error("Failed to create stock receipt:", error);
      return { error: error instanceof Error ? error.message : "Failed to create receipt" };
    }
  });
}
