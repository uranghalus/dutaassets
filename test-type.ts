import { itemFormSchema } from './schema/item-schema';
import { z } from 'zod';

type InferredType = z.infer<typeof itemFormSchema>;
const test: InferredType = {
    code: 'test',
    name: 'test',
    unit: 'PCS',
    minStock: 0,
};

console.log('Inferred type for minStock:', typeof test.minStock);
