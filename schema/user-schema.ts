import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')), 
  role: z.string().min(1, 'Role is required'),
  isBanned: z.boolean().optional(),
  banReason: z.string().optional(),
  
  // Custom field for linking employee
  employeeId: z.string().optional(),
  
  isEdit: z.boolean().optional(),
});

export type UserForm = z.infer<typeof userFormSchema>;
