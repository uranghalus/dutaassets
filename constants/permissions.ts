// constants/permissions.ts
export const PERMISSIONS = {
  role: ['view', 'list', 'create', 'edit', 'delete'],
  employee: [
    'view',
    'list',
    'create',
    'edit',
    'delete',
    'sync-user',
    'unsync-user',
  ],
  department: ['view', 'list', 'create', 'edit', 'delete'],
  division: ['view', 'list', 'create', 'edit', 'delete'],
  inventory: ['view', 'create', 'edit', 'delete'],
} as const;

export type PermissionMap = {
  [K in keyof typeof PERMISSIONS]?: (typeof PERMISSIONS)[K][number][];
};
