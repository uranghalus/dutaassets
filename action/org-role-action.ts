"use server";

import { headers } from "next/headers";
import { getServerSession } from "@/lib/get-session";
import { auth } from "@/lib/auth";
import { withContext } from "@/lib/action-utils";

// =============================================================================
// HELPER — menggunakan auth.api.hasPermission() langsung
// Resource yang dijaga: `role` dan `ac` (Role & Permission menu)
// =============================================================================

async function requireRolePermission(actions: string[]) {
  try {
    await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          role: actions,
        },
      },
    });
  } catch {
    throw new Error("Forbidden: insufficient permissions");
  }
}

// =============================================================================
// TYPES
// =============================================================================

type ListOrgRoleArgs = {
  page: number;
  pageSize: number;
};

export type UpdateOrgRoleInput = {
  roleId: string;
  roleName: string;
  permission: Record<string, string[]>;
};

// =============================================================================
// LIST
// =============================================================================

export async function listOrgRoles({ page, pageSize }: ListOrgRoleArgs) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error("No active organization");

  // 🔐 Hanya role yang punya izin `role: read` (owner & admin)
  await auth.api
    .hasPermission({
      headers: await headers(),
      body: { permissions: { role: ["read"] } },
    })
    .catch(() => {
      throw new Error("Forbidden");
    });

  const res = await auth.api.listOrgRoles({
    query: { organizationId },
    headers: await headers(),
  });

  const allRoles = res ?? [];

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    data: allRoles.slice(start, end),
    total: allRoles.length,
    page: safePage,
    pageSize: safePageSize,
    pageCount: Math.ceil(allRoles.length / safePageSize),
  };
}

// =============================================================================
// CREATE
// =============================================================================

export async function createOrgRole(input: {
  role: string;
  permission: Record<string, string[]>;
}) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    // 🔐 Butuh role:create DAN ac:create
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["create"],
            ac: ["create"],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    return auth.api.createOrgRole({
      body: {
        role: input.role,
        permission: input.permission,
        organizationId,
      },
      headers: await headers(),
    });
  });
}

// =============================================================================
// UPDATE
// =============================================================================

export async function updateOrgRole(input: UpdateOrgRoleInput) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    // 🔐 Butuh role:edit DAN ac:edit
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["edit"],
            ac: ["edit"],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    return auth.api.updateOrgRole({
      body: {
        roleId: input.roleId,
        roleName: input.roleName,
        organizationId,
        data: {
          roleName: input.roleName,
          permission: input.permission,
        },
      },
      headers: await headers(),
    });
  });
}

// =============================================================================
// DELETE
// =============================================================================

export async function deleteOrgRole(roleId: string) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    // 🔐 Butuh role:delete DAN ac:delete
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["delete"],
            ac: ["delete"],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    return auth.api.deleteOrgRole({
      body: { roleId, organizationId },
      headers: await headers(),
    });
  });
}

export async function deleteOrgRolesBulk(roleIds: string[]) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error("No active organization");

    // 🔐 Butuh role:delete DAN ac:delete
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["delete"],
            ac: ["delete"],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    const reqHeaders = await headers();
    await Promise.all(
      roleIds.map((roleId) =>
        auth.api.deleteOrgRole({
          body: { roleId, organizationId },
          headers: reqHeaders,
        }),
      ),
    );

    return { success: true };
  });
}
