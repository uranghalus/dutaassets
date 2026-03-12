import { z } from "zod";

export const assetFormSchema = z.object({
  // Direct input fields replacing itemId
  assetName: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),

  department_id: z.string().min(1, "Department is required"),
  divisi_id: z.string().nullable().optional(),
  karyawan_id: z.string().nullable().optional(),

  serial_number: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),

  tgl_pembelian: z.date().nullable().optional(),

  kondisi: z.string().optional(),
  lokasi: z.string().nullable().optional(),
  locationId: z.string().nullable().optional(),

  garansi_exp: z.date().nullable().optional(),

  status: z.enum([
    "AVAILABLE",
    "LOANED",
    "UNDER_MAINTENANCE",
    "DISPOSED",
    "LOST",
    "IN_USE",
    "MAINTENANCE",
  ]),
  deskripsi: z.string().nullable().optional(),
});

export type AssetForm = z.infer<typeof assetFormSchema>;
