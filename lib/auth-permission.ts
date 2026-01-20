import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';
import { createAccessControl } from 'better-auth/plugins/access';

export const statement = {
  ...defaultStatements,

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

  user: [
    'view',
    'list',
    'create',
    'edit',
    'delete',
    'set-role',
    'ban',
    'impersonate',
    'set-password',
  ],
} as const;

export const ac = createAccessControl(statement);
