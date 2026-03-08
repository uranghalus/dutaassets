import { z } from "zod";

export const stockIssuanceFormSchema = z.object({
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

export type StockIssuanceFormValues = z.infer<typeof stockIssuanceFormSchema>;
