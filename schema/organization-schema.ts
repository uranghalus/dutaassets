import { z } from 'zod';

/**
 * Slug:
 * - lowercase
 * - alphanumeric + dash
 * - no space
 * - no double dash
 */
export const organizationSlugSchema = z
  .string()
  .min(3, 'Slug minimal 3 karakter')
  .max(50, 'Slug maksimal 50 karakter')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug hanya boleh huruf kecil, angka, dan dash (-)'
  );

export const organizationFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama organization minimal 2 karakter')
    .max(100, 'Nama organization terlalu panjang'),

  slug: organizationSlugSchema,

  /**
   * Flag UI only (tidak dikirim ke server)
   * dipakai untuk membedakan create / edit
   */
  isEdit: z.boolean().optional(),
});

export type OrganizationForm = z.infer<typeof organizationFormSchema>;
