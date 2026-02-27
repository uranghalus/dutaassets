import { z } from "zod";

export const assetMaintenanceSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  maintenanceDate: z.date(),
  type: z.enum(["PREVENTIVE", "REPAIR"]),
  provider: z.string().min(1, "Provider/Technician name is required"),
  cost: z.coerce.number().min(0, "Cost must be at least 0"),
  description: z.string().optional(),
  status: z.enum(["SCHEDULED", "COMPLETED"]),
});

export type AssetMaintenanceFormValues = z.infer<typeof assetMaintenanceSchema>;
