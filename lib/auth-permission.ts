import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/organization/access';

export const statement = {
  ...defaultStatements,
  ac: ['view', 'list', 'create', 'edit', 'delete', 'read', 'update'],
  role: ['view', 'list', 'create', 'edit', 'delete', 'read', 'update'],
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
  team: ['create', 'update', 'delete'],
} as const;

export const ac = createAccessControl(statement);
export const owner = ac.newRole({
  ac: ['view', 'list', 'create', 'edit', 'delete', 'read', 'update'],
  role: ['view', 'list', 'create', 'edit', 'delete', 'read', 'update'],
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
  team: ['create', 'update', 'delete'],
  member: ['create', 'update', 'delete'],
  invitation: ['create', 'cancel'],
  organization: ['update', 'delete'],
});

export const admin = ac.newRole({
  ac: ['view', 'list', 'create', 'edit', 'delete', 'read', 'update'],
  role: ['view', 'list', 'create', 'edit', 'delete', 'read', 'update'],
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
  team: ['create', 'update', 'delete'],
  member: ['create', 'update', 'delete'],
  invitation: ['create', 'cancel'],
  organization: ['update'],
});

export const member = ac.newRole({
  employee: ['view', 'list'],
  department: ['view', 'list'],
  division: ['view', 'list'],
  inventory: ['view'],
});
