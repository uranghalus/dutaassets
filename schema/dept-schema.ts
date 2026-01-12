import { z } from 'zod';

export const departmentFormSchema = z.object({
  kode_department: z.string().min(1, 'Kode department wajib diisi'),
  nama_department: z.string().min(1, 'Nama department wajib diisi'),
  organization_id: z.string().min(1, 'Unit bisnis wajib dipilih'),
  id_hod: z.string().optional(),
  isEdit: z.boolean().optional(),
});

export type DepartmentForm = z.infer<typeof departmentFormSchema>;
