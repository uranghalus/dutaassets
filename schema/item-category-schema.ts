import { z } from 'zod';

export const itemCategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ItemCategoryForm = z.infer<typeof itemCategoryFormSchema>;
