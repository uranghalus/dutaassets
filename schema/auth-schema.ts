import z from 'zod';

export const LoginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});
export type SignInValues = z.infer<typeof LoginSchema>;
