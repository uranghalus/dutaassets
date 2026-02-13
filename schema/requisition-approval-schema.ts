import { z } from "zod";

export const requisitionApprovalSchema = z.object({
  id: z.string().min(1, "Requisition ID is required"),
  status: z.enum(["PENDING_FA", "PENDING_GM", "PENDING_WAREHOUSE", "COMPLETED", "REJECTED"]),
  remarks: z.string().optional(),
  warehouseId: z.string().optional(),
});

export type RequisitionApproval = z.infer<typeof requisitionApprovalSchema>;
