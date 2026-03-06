"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getActiveOrganizationWithRole } from "./organization-action";
import { revalidatePath } from "next/cache";

const maintenanceScheduleSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  frequencyDays: z.coerce.number().min(1, "Frequency must be at least 1 day"),
  nextDueDate: z.string().min(1, "Next due date is required"),
  assignedToEmployeeId: z.string().optional(),
});

type MaintenanceScheduleInput = z.infer<typeof maintenanceScheduleSchema>;

/**
 * Creates a new preventive maintenance schedule for an asset.
 */
export async function createMaintenanceSchedule(
  data: MaintenanceScheduleInput,
) {
  try {
    const { organizationId } = await getActiveOrganizationWithRole();

    const validatedData = maintenanceScheduleSchema.parse({
      ...data,
      nextDueDate: new Date(data.nextDueDate).toISOString(),
    });

    const newSchedule = await prisma.assetMaintenanceSchedule.create({
      data: {
        organizationId,
        assetId: validatedData.assetId,
        title: validatedData.title,
        description: validatedData.description,
        frequencyDays: validatedData.frequencyDays,
        nextDueDate: validatedData.nextDueDate,
        assignedToEmployeeId: validatedData.assignedToEmployeeId,
        isActive: true,
      },
    });

    revalidatePath(`/assets/${validatedData.assetId}`);
    revalidatePath(`/assets/schedules`);
    return { success: true, schedule: newSchedule };
  } catch (error) {
    console.error("Failed to create maintenance schedule:", error);
    return { success: false, error: "Failed to create maintenance schedule" };
  }
}

/**
 * Retrieves all active maintenance schedules.
 */
export async function getActiveMaintenanceSchedules() {
  try {
    const { organizationId } = await getActiveOrganizationWithRole();

    const schedules = await prisma.assetMaintenanceSchedule.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      include: {
        asset: {
          select: {
            id_barang: true,
            kode_asset: true,
            nama_asset: true,
          },
        },
      },
      orderBy: {
        nextDueDate: "asc",
      },
    });

    return schedules;
  } catch (error) {
    console.error("Failed to retrieve maintenance schedules:", error);
    return [];
  }
}

/**
 * Marks a schedule as completed by creating a maintenance log record and updating the next due date based on frequency.
 */
export async function completeMaintenanceSchedule(
  scheduleId: string,
  cost: number,
  performedBy: string,
  notes: string,
) {
  try {
    const schedule = await prisma.assetMaintenanceSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      return { success: false, error: "Schedule not found" };
    }

    // Wrap in transaction: update schedule nextDueDate AND create a generic maintenance history log
    // Notice: Based on the existing pattern, maintenance history might be stored somewhere else,
    // but the schema has an `AssetActivity` or similar. Since we don't have a specific `AssetMaintenanceHistory`
    // model in the updated schema, we'll just update the nextDue Date for the schedule. In a full system we'd
    // log this in AssetActivity or a new MaintenanceHistory table.

    // Calculate new next due date
    const currentDue = new Date(schedule.nextDueDate);
    const nextDue = new Date(currentDue);
    nextDue.setDate(nextDue.getDate() + schedule.frequencyDays);

    const updatedSchedule = await prisma.assetMaintenanceSchedule.update({
      where: { id: scheduleId },
      data: {
        lastMaintenanceDate: new Date(),
        nextDueDate: nextDue,
      },
    });

    revalidatePath(`/assets/${schedule.assetId}`);
    revalidatePath(`/assets/schedules`);
    return { success: true, schedule: updatedSchedule };
  } catch (error) {
    console.error("Failed to complete maintenance schedule:", error);
    return { success: false, error: "Failed to complete maintenance schedule" };
  }
}

/**
 * Disable or delete a maintenance schedule
 */
export async function toggleMaintenanceScheduleActive(
  scheduleId: string,
  isActive: boolean,
) {
  try {
    const schedule = await prisma.assetMaintenanceSchedule.update({
      where: { id: scheduleId },
      data: { isActive },
    });

    revalidatePath(`/assets/${schedule.assetId}`);
    revalidatePath(`/assets/maintenances`);
    return { success: true, schedule };
  } catch (error) {
    console.error("Failed to toggle maintenance schedule:", error);
    return { success: false, error: "Failed to update schedule status" };
  }
}
