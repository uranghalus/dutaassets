import { z } from 'zod';

export const assetCategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AssetCategoryForm = z.infer<typeof assetCategoryFormSchema>;
