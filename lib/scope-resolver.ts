/**
 * lib/scope-resolver.ts
 *
 * Menentukan apakah seorang user memiliki akses GLOBAL (semua departemen)
 * atau akses DEPARTMENT (hanya departemen sendiri) berdasarkan jabatan/role-nya.
 *
 * Gunakan ini sebelum query Prisma untuk membangun filter `where` yang tepat.
 */

/** Scope yang mungkin dimiliki user */
export type UserScope = "global" | "department";

/**
 * Role-role yang memiliki akses GLOBAL (lintas departemen).
 * Semua role lain secara otomatis mendapat scope DEPARTMENT.
 */
const GLOBAL_SCOPE_ROLES: readonly string[] = [
  "owner",
  "admin",
  "finance_manager",
  "staff_asset",
];

/**
 * Resolves the data scope for a given organization role.
 *
 * @param role - The member's role string (e.g. 'manager', 'staff_lapangan')
 * @returns 'global' jika role boleh akses semua dept, 'department' jika hanya dept sendiri
 *
 * @example
 * const scope = resolveUserScope('finance_manager'); // 'global'
 * const scope = resolveUserScope('supervisor');      // 'department'
 */
export function resolveUserScope(role: string): UserScope {
  return GLOBAL_SCOPE_ROLES.includes(role) ? "global" : "department";
}
