'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getServerSession } from '@/lib/get-session';
import { requirePermission } from '@/lib/auth-guard';

type CreateOrgRoleInput = {
  role: string;
  permission: Record<string, string[]>;
};
export async function listOrgRoles() {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  await requirePermission({
    role: ['read'],
  });

  return auth.api.listOrgRoles({
    query: { organizationId },
    headers: await headers(),
  });
}
export async function createOrgRole(input: CreateOrgRoleInput) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  /* 🔐 DAC CHECK */
  await requirePermission({
    role: ['create'],
  });

  return auth.api.createOrgRole({
    body: {
      role: input.role,
      permission: input.permission,
      organizationId,
    },
    headers: await headers(),
  });
}
