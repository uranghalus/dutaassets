import { Karyawan, Divisi } from '@/generated/prisma/client';

export type EmployeeWithDivisi = Karyawan & {
  divisi_fk: Divisi;
};
