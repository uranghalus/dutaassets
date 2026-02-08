import { z } from "zod";

export const stockAdjustmentItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantityChange: z.coerce.number().int().refine((val) => val !== 0, "Quantity must not be zero"),
  remarks: z.string().optional(),
});

export const stockAdjustmentFormSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
  reference: z.string().optional(),
  items: z.array(stockAdjustmentItemSchema).min(1, "At least one item is required"),
});

export type StockAdjustmentForm = z.infer<typeof stockAdjustmentFormSchema>;
export type StockAdjustmentItemForm = z.infer<typeof stockAdjustmentItemSchema>;
