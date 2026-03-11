"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { withContext } from "@/lib/action-utils";

const safetyInspectionFormSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  shift: z.enum(["PAGI", "SIANG", "MALAM", "MIDDLE"]),
  inspectionDate: z.string().min(1, "Inspection date is required"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        itemName: z.string().min(1, "Item name is required"),
        status: z.string().min(1, "Status is required"),
        note: z.string().optional(),
      }),
    )
    .min(1, "At least one checklist item is required"),
});

export async function getSafetyInspections({
  page = 0,
  pageSize = 10,
  equipmentId,
}: {
  page?: number;
  pageSize?: number;
  equipmentId?: string;
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

  const where = {
    organizationId,
    ...(equipmentId ? { equipmentId } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.safetyInspection.findMany({
      where,
      include: {
        equipment: {
          include: {
            asset: { select: { item: { select: { name: true, code: true } } } },
          },
        },
        inspector: { select: { id: true, name: true } },
        items: true,
        photos: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { inspectionDate: "desc" },
    }),
    prisma.safetyInspection.count({ where }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createSafetyInspection(formData: FormData) {
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
      equipmentId: formData.get("equipmentId"),
      shift: formData.get("shift"),
      inspectionDate: formData.get("inspectionDate"),
      notes: formData.get("notes") || undefined,
      items: parsedItems,
    };

    const validatedFields = safetyInspectionFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { equipmentId, shift, inspectionDate, notes, items } =
      validatedFields.data;

    try {
      await prisma.safetyInspection.create({
        data: {
          organizationId,
          equipmentId,
          shift,
          inspectionDate: new Date(inspectionDate),
          inspectorUserId: session.user.id,
          notes,
          items: {
            create: items.map((item) => ({
              itemName: item.itemName,
              status: item.status,
              note: item.note,
            })),
          },
        },
      });

      revalidatePath("/safety/inspections");

      return { success: true };
    } catch (error) {
      console.error("Failed to create safety inspection:", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create safety inspection",
      };
    }
  });
}
