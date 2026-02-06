
import { z } from 'zod';

export const teamFormSchema = z.object({
  nama_team: z.string().min(1, 'Role name is required'),
  kode_team: z.string().min(1, 'Code is required'),
  divisi_id: z.string().min(1, 'Division is required'),
  keterangan: z.string().optional(),
});

export type TeamForm = z.infer<typeof teamFormSchema>;
