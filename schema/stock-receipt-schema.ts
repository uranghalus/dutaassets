import { z } from "zod";

export const stockReceiptItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const stockReceiptFormSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse is required"),
  vendorName: z.string().optional(),
  referenceNumber: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(stockReceiptItemSchema).min(1, "At least one item is required"),
});

export type StockReceiptForm = z.infer<typeof stockReceiptFormSchema>;
export type StockReceiptItemForm = z.infer<typeof stockReceiptItemSchema>;
