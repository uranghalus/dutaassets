
import { z } from 'zod';

export const warehouseFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().optional(),
});

export type WarehouseForm = z.infer<typeof warehouseFormSchema>;
