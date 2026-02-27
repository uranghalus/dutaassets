"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withContext } from "@/lib/action-utils";
import { getActiveOrganizationWithRole } from "./organization-action";

// =============================================================================
// HELPER — menggunakan auth.api.hasPermission() langsung
// Resource yang dijaga: `role` dan `ac` (Role & Permission menu)
// =============================================================================

type PermissionAction =
  | "create"
  | "delete"
  | "update"
  | "list"
  | "view"
  | "edit"
  | "read";

async function requireRolePermission(actions: PermissionAction[]) {
  await auth.api
    .hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          role: actions,
        },
      },
    })
    .catch(() => {
      throw new Error("Forbidden: insufficient permissions");
    });
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
  const { organizationId } = await getActiveOrganizationWithRole();

  // 🔐 Hanya role yang punya izin `role: read` (owner & admin)
  await requireRolePermission(["read"]);

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  const [allRoles, total] = await Promise.all([
    prisma.organizationRole.findMany({
      where: { organizationId },
      orderBy: { createdAt: "asc" },
      skip,
      take: safePageSize,
    }),
    prisma.organizationRole.count({ where: { organizationId } }),
  ]);

  return {
    data: allRoles,
    total,
    page: safePage,
    pageSize: safePageSize,
    pageCount: Math.ceil(total / safePageSize),
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
    const { organizationId } = await getActiveOrganizationWithRole();

    // 🔐 Butuh role:create DAN ac:create
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["create"] as PermissionAction[],
            ac: ["create"] as PermissionAction[],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    return prisma.organizationRole.create({
      data: {
        id: crypto.randomUUID(),
        organizationId,
        role: input.role,
        permission: JSON.stringify(input.permission),
      },
    });
  });
}

// =============================================================================
// UPDATE
// =============================================================================

export async function updateOrgRole(input: UpdateOrgRoleInput) {
  return withContext(async () => {
    await getActiveOrganizationWithRole();

    // 🔐 Butuh role:edit DAN ac:edit
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["edit"] as PermissionAction[],
            ac: ["edit"] as PermissionAction[],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    return prisma.organizationRole.update({
      where: { id: input.roleId },
      data: {
        role: input.roleName,
        permission: JSON.stringify(input.permission),
      },
    });
  });
}

// =============================================================================
// DELETE
// =============================================================================

export async function deleteOrgRole(roleId: string) {
  return withContext(async () => {
    await getActiveOrganizationWithRole();

    // 🔐 Butuh role:delete DAN ac:delete
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["delete"] as PermissionAction[],
            ac: ["delete"] as PermissionAction[],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    return prisma.organizationRole.delete({
      where: { id: roleId },
    });
  });
}

export async function deleteOrgRolesBulk(roleIds: string[]) {
  return withContext(async () => {
    await getActiveOrganizationWithRole();

    // 🔐 Butuh role:delete DAN ac:delete
    await auth.api
      .hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            role: ["delete"] as PermissionAction[],
            ac: ["delete"] as PermissionAction[],
          },
        },
      })
      .catch(() => {
        throw new Error("Forbidden");
      });

    await prisma.organizationRole.deleteMany({
      where: { id: { in: roleIds } },
    });

    return { success: true };
  });
}
