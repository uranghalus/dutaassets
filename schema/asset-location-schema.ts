import { z } from "zod";

export const assetLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type AssetLocationFormValues = z.infer<typeof assetLocationSchema>;
