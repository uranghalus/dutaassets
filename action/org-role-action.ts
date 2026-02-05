'use server';

import { headers } from 'next/headers';
import { getServerSession } from '@/lib/get-session';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth-guard';

type ListOrgRoleArgs = {
  page: number;
  pageSize: number;
};

export async function listOrgRoles({ page, pageSize }: ListOrgRoleArgs) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  /* 🔐 DAC CHECK */
  await requirePermission({
    role: ['read'],
  });

  const res = await auth.api.listOrgRoles({
    query: { organizationId },
    headers: await headers(),
  });

  const allRoles = res ?? [];

  /* 🧠 MANUAL PAGINATION */
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  const pagedData = allRoles.slice(start, end);

  return {
    data: pagedData,
    total: allRoles.length,
    page: safePage,
    pageSize: safePageSize,
    pageCount: Math.ceil(allRoles.length / safePageSize),
  };
}
export async function createOrgRole(input: {
  role: string;
  permission: Record<string, string[]>;
}) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

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
export type UpdateOrgRoleInput = {
  roleId: string;
  roleName: string;
  permission: Record<string, string[]>;
};

export async function updateOrgRole(input: UpdateOrgRoleInput) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  /* 🔐 DAC CHECK */
  await requirePermission({
    role: ['edit'],
  });

  return auth.api.updateOrgRole({
    body: {
      roleId: input.roleId,
      roleName: input.roleName, // role lama (identifier)
      organizationId,
      data: {
        roleName: input.roleName, // bisa diganti kalau mau rename
        permission: input.permission,
      },
    },
    headers: await headers(),
  });
}

export async function deleteOrgRole(roleId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  /* 🔐 DAC CHECK */
  await requirePermission({
    role: ['delete'],
  });

  return auth.api.deleteOrgRole({
    body: {
      roleId,
      organizationId,
    },
    headers: await headers(),
  });
}

export async function deleteOrgRolesBulk(roleIds: string[]) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  /* 🔐 DAC CHECK */
  await requirePermission({
    role: ['delete'],
  });

  const reqHeaders = await headers();
  await Promise.all(
    roleIds.map((roleId) =>
      auth.api.deleteOrgRole({
        body: {
          roleId,
          organizationId,
        },
        headers: reqHeaders,
      })
    )
  );

  return { success: true };
}
