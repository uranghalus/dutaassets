import { z } from "zod";

export const safetyInspectionFormSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  shift: z.enum(["PAGI", "SIANG", "MALAM", "MIDDLE"], {
    required_error: "Shift is required",
  }),
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

export type SafetyInspectionFormValues = z.infer<
  typeof safetyInspectionFormSchema
>;
