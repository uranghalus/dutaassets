import { z } from "zod";

export const requisitionItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const requisitionFormSchema = z.object({
  warehouseId: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(requisitionItemSchema).min(1, "At least one item is required"),
});

export type RequisitionForm = z.infer<typeof requisitionFormSchema>;
export type RequisitionItemForm = z.infer<typeof requisitionItemSchema>;
