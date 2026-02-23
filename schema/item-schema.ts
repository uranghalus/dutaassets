
import { z } from 'zod';

export const itemFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  category: z.string().optional(), // Kept for legacy/fallback
  categoryId: z.string().optional(),
  unit: z.string().min(1, 'Unit is required'),
  minStock: z.number().min(0, 'Minimum stock cannot be negative'),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type ItemForm = z.infer<typeof itemFormSchema>;
