import { z } from 'zod';

export const userFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  isBanned: z.boolean().optional(),
  banReason: z.string().optional(),
  
  // Link to Employee is now central
  employeeId: z.string().min(1, 'Employee is required'),
  
  isEdit: z.boolean().optional(),
});

export type UserForm = z.infer<typeof userFormSchema>;
