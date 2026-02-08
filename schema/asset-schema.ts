import { z } from "zod";

export const assetFormSchema = z.object({
  kode_asset: z.string().min(1, "Asset Code is required").max(50, "Max 50 characters"),
  nama_asset: z.string().min(1, "Asset Name is required"),
  kategori_asset: z.string().min(1, "Category is required").max(100),
  
  department_id: z.string().min(1, "Department is required"),
  divisi_id: z.string().optional().nullable(),
  karyawan_id: z.string().optional().nullable(),
  
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "DISPOSED"]).default("AVAILABLE"),
  kondisi: z.enum(["GOOD", "DAMAGED"]).optional().nullable(),

  brand: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  serial_number: z.string().max(100).optional().nullable(),
  
  lokasi: z.string().max(200).optional().nullable(),
  deskripsi: z.string().optional().nullable(),
  
  tgl_pembelian: z.coerce.date().optional().nullable(),
  harga: z.coerce.number().min(0).optional().nullable(),
  vendor: z.string().max(100).optional().nullable(),
  garansi_exp: z.coerce.date().optional().nullable(),

  // Optional string fields for images or expand_data if needed later
});

export type AssetForm = z.infer<typeof assetFormSchema>;
