/**
 * lib/asset-guard.ts
 *
 * Helper keamanan untuk action yang berkaitan dengan aset.
 * Menyediakan dua fungsi utama:
 * 1. requireAssetPermission() — cek izin via Better Auth API
 * 2. getDepartmentFilter()    — bangun filter Prisma berdasarkan scope user
 */

import { auth } from "@/lib/auth";
import { resolveUserScope } from "@/lib/scope-resolver";
import { headers } from "next/headers";

/** Tipe input permissions, misal: { asset: ['create'] } */
type PermissionInput = {
  [resource: string]: string[];
};

/**
 * Memeriksa apakah user yang sedang login memiliki permission yang diminta.
 * Jika tidak, akan melempar error `Forbidden`.
 *
 * Menggunakan `auth.api.hasPermission()` dari Better Auth — ini sudah
 * memperhitungkan Dynamic Access Control (role yang disimpan di database).
 *
 * @param permissions - Objek permission, contoh: { asset: ['create', 'edit'] }
 * @throws Error('Forbidden') jika user tidak memiliki permission
 *
 * @example
 * await requireAssetPermission({ asset: ['delete'] });
 * await requireAssetPermission({ 'asset.transfer': ['approve'] });
 */
export async function requireAssetPermission(
  permissions: PermissionInput,
): Promise<void> {
  try {
    await auth.api.hasPermission({
      headers: await headers(),
      body: { permissions },
    });
  } catch {
    throw new Error("Forbidden: insufficient permissions for this action");
  }
}

/**
 * Membangun filter Prisma `where` clause berdasarkan scope user.
 *
 * - Jika scope GLOBAL  → `{}` (tidak ada filter departemen → lihat semua)
 * - Jika scope DEPARTMENT → `{ department_id: departmentId }` (hanya dept sendiri)
 *
 * @param role - Role string dari member (e.g. 'manager', 'staff_lapangan')
 * @param departmentId - ID departemen user yang sedang login
 * @returns Objek filter yang bisa di-spread ke `where` clause Prisma
 *
 * @example
 * const filter = getDepartmentFilter(role, departmentId);
 * await prisma.asset.findMany({ where: { ...filter, organization_id: orgId } });
 */
export function getDepartmentFilter(
  role: string,
  departmentId: string,
): { department_id?: string } {
  const scope = resolveUserScope(role);
  return scope === "global" ? {} : { department_id: departmentId };
}

/**
 * Memeriksa apakah sebuah transfer merupakan transfer lintas departemen.
 * Jika ya, akan memvalidasi bahwa user memiliki izin `cross_department`.
 *
 * @param fromDepartmentId - Departemen asal aset
 * @param toDepartmentId   - Departemen tujuan aset
 * @throws Error('Forbidden') jika transfer lintas dept tapi user tidak punya izin
 *
 * @example
 * await requireCrossDepartmentPermissionIfNeeded('dept-a', 'dept-b');
 */
export async function requireCrossDepartmentPermissionIfNeeded(
  fromDepartmentId: string | null | undefined,
  toDepartmentId: string | null | undefined,
): Promise<void> {
  // Jika salah satu null/undefined, atau sama → bukan cross-dept
  if (
    !fromDepartmentId ||
    !toDepartmentId ||
    fromDepartmentId === toDepartmentId
  ) {
    return;
  }

  // Transfer beda dept → wajib punya izin cross_department
  await requireAssetPermission({
    "asset.transfer": ["cross_department"],
  });
}
