import { Karyawan, Divisi, Department } from '@/generated/prisma/client';

export type EmployeeWithDivisi = Karyawan & {
  divisi_fk: Divisi & {
    department: Department | null;
  };
};
