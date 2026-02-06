
import { z } from 'zod';

export const teamMemberFormSchema = z.object({
  userId: z.string().min(1, 'User is required'),
});

export type TeamMemberForm = z.infer<typeof teamMemberFormSchema>;
