"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { withContext } from "@/lib/action-utils";

const stockIssuanceFormSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse is required"),
  issuedTo: z.string().optional(),
  referenceNumber: z.string().optional(),
  remarks: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1, "Item is required"),
        quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
      }),
    )
    .min(1, "At least one item is required"),
});

export async function getStockIssuances({
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
    prisma.stockIssuance.findMany({
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
    prisma.stockIssuance.count({
      where: { organizationId },
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createStockIssuance(formData: FormData) {
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
      if (itemsJson) {
        parsedItems = JSON.parse(itemsJson);
      }
    } catch (error) {
      return { error: "Invalid items data format" };
    }

    const rawData = {
      warehouseId: formData.get("warehouseId"),
      issuedTo: formData.get("issuedTo"),
      referenceNumber: formData.get("referenceNumber"),
      remarks: formData.get("remarks"),
      items: parsedItems,
    };

    const validatedFields = stockIssuanceFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { warehouseId, issuedTo, referenceNumber, remarks, items } =
      validatedFields.data;

    try {
      await prisma.$transaction(async (tx) => {
        // Pre-validate stock availability for all items to avoid partial failures
        for (const item of items) {
          const currentStock = await tx.stock.findUnique({
            where: {
              warehouseId_itemId: {
                warehouseId,
                itemId: item.itemId,
              },
            },
          });

          if (!currentStock || currentStock.quantity < item.quantity) {
            throw new Error(
              `Insufficient stock for one or more items in the selected warehouse.`,
            );
          }
        }

        // 1. Create StockIssuance Header
        const issuance = await tx.stockIssuance.create({
          data: {
            organizationId,
            warehouseId,
            issuedTo,
            referenceNumber,
            remarks,
          },
        });

        // 2. Process Items
        for (const item of items) {
          // a. Create Issuance Detail Record
          await tx.stockIssuanceItem.create({
            data: {
              stockIssuanceId: issuance.id,
              itemId: item.itemId,
              quantity: item.quantity,
            },
          });

          // b. Decrement from Stock (Update)
          await tx.stock.update({
            where: {
              warehouseId_itemId: {
                warehouseId: warehouseId,
                itemId: item.itemId,
              },
            },
            data: {
              quantity: { decrement: item.quantity },
            },
          });
        }
      });

      revalidatePath("/inventory/issuances");
      revalidatePath("/inventory/stocks");

      return { success: true };
    } catch (error) {
      console.error("Failed to create stock issuance:", error);
      return {
        error:
          error instanceof Error ? error.message : "Failed to create issuance",
      };
    }
  });
}
