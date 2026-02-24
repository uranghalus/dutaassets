import { z } from "zod";

export const assetFormSchema = z.object({
  kode_asset: z.string().min(1, "Asset code is required"),
  nama_asset: z.string().min(1, "Asset name is required"),

  categoryId: z.string().min(1, "Category is required"),

  department_id: z.string().min(1, "Department is required"),

  divisi_id: z.string().nullable().optional(),
  karyawan_id: z.string().nullable().optional(),

  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  serial_number: z.string().nullable().optional(),

  tgl_pembelian: z.date().nullable().optional(),
  harga: z.number().nullable().optional(),
  vendor: z.string().nullable().optional(),

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
