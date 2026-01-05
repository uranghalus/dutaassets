import { statement } from '@/lib/auth-permission';

/**
 * Resource names: "project" | "user" | "apar" | ...
 */
export type PermissionResource = keyof typeof statement;

/**
 * Action per resource
 * contoh:
 *   PermissionAction<'inspection'>
 *   → "view" | "create" | "approve" | ...
 */
export type PermissionAction<R extends PermissionResource> =
  (typeof statement)[R][number];

/**
 * Bentuk hasil auth.api.hasPermission().permissions
 */
export type Permissions = {
  [R in PermissionResource]: {
    [A in PermissionAction<R>]?: boolean;
  };
};
