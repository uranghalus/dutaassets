import { z } from 'zod';

export const employeeFormSchema = z.object({
  nik: z.string().min(1),
  nama: z.string().min(1),
  nama_alias: z.string().optional(),
  alamat: z.string().optional(),
  no_ktp: z.string().length(16),
  telp: z.string().optional(),
  divisi_id: z.string().min(1),
  jabatan: z.string().optional(),
  call_sign: z.string().optional(),
  status_karyawan: z.string().optional(),
  keterangan: z.string().optional(),
  isEdit: z.boolean().optional(),
});

export type EmployeeForm = z.infer<typeof employeeFormSchema>;
