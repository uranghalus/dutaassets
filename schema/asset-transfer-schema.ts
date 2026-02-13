import { z } from "zod";

export const assetTransferSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  fromLocationId: z.string().optional().nullable(),
  toLocationId: z.string().optional().nullable(),
  fromEmployeeId: z.string().optional().nullable(),
  toEmployeeId: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type AssetTransferSchema = z.infer<typeof assetTransferSchema>;

export const assetTransferStatusSchema = z.enum(["PENDING", "APPROVED", "COMPLETED", "CANCELLED"]);
