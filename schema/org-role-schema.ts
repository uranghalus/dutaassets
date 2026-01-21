import { z } from 'zod';

export const orgRoleFormSchema = z.object({
  role: z.string().min(2, 'Role name minimal 2 karakter'),
  permission: z.string().min(2, 'Permission tidak boleh kosong'),
  isEdit: z.boolean().optional(),
});

export type OrgRoleForm = z.infer<typeof orgRoleFormSchema>;
