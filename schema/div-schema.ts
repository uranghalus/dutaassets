import { z } from 'zod';

export const divisionFormSchema = z.object({
  nama_divisi: z.string().min(2, 'Nama divisi minimal 2 karakter'),
  department_id: z.string().min(1, 'Department wajib dipilih'),

  ext_tlp: z.string().optional().nullable(),

  // helper untuk UI (bukan ke DB)
  isEdit: z.boolean().optional(),
});

export type DivisionForm = z.infer<typeof divisionFormSchema>;
