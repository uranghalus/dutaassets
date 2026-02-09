import { z } from 'zod';

export const employeeFormSchema = z.object({
  /** =========================
   *  CORE
   *  ========================= */
  nik: z.string().min(1, 'NIK is required'),

  nama: z.string().min(1, 'Nama is required'),

  /** =========================
   *  OPTIONAL IDENTITY
   *  ========================= */
  nama_alias: z.string().optional(),

  alamat: z.string().optional(),

  no_ktp: z.string().length(16, 'No KTP must be 16 digits'),

  telp: z.string().optional(),

  /** =========================
   *  RELATION
   *  ========================= */
  divisi_id: z.string().min(1, 'Divisi is required'),

  /** =========================
   *  JOB INFO
   *  ========================= */
  jabatan: z.string().optional(),

  call_sign: z.string().optional(),

  status_karyawan: z.string().optional(),

  keterangan: z.string().optional(),

  /** =========================
   *  PERSONAL DETAILS
   *  ========================= */
  tempat_lahir: z.string().optional(),
  tgl_lahir: z.date().optional(),
  foto: z.string().optional(),

  /** =========================
   *  EMPLOYMENT DETAILS
   *  ========================= */
  tgl_masuk: z.date().optional(),

  /** =========================
   *  INTERNAL
   *  ========================= */
  isEdit: z.boolean().optional(),
});

export type EmployeeForm = z.infer<typeof employeeFormSchema>;
