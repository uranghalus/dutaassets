import { z } from "zod";

export const stockTransferItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const stockTransferFormSchema = z.object({
  fromWarehouseId: z.string().min(1, "Source warehouse is required"),
  toWarehouseId: z.string().min(1, "Destination warehouse is required"),
  remarks: z.string().optional(),
  items: z.array(stockTransferItemSchema).min(1, "At least one item is required"),
}).refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
  message: "Source and destination warehouse cannot be the same",
  path: ["toWarehouseId"],
});

export type StockTransferForm = z.infer<typeof stockTransferFormSchema>;
export type StockTransferItemForm = z.infer<typeof stockTransferItemSchema>;
