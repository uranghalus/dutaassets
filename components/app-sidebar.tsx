"use client";

import { useLayout } from "@/context/layout-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { OrganizationSwitcher } from "@/components/organization-switcher";

import { sidebarData } from "@/config/sidebar-data";
import { authClient } from "@/lib/auth-client";
import type { NavItem } from "@/types";

/**
 * Cek apakah satu item/group diperbolehkan tampil berdasarkan role user.
 * - Jika `roles` tidak didefinisikan → visible untuk semua.
 * - Jika `roles` didefinisikan → user harus ada di salah satu role tersebut.
 */
function isAllowed(
  roles: string[] | undefined,
  userRole: string | undefined,
): boolean {
  if (!roles || roles.length === 0) return true; // no restriction
  if (!userRole) return false; // no role = deny
  return roles.includes(userRole);
}

/**
 * Filter item-item dalam satu group berdasarkan role user.
 */
function filterItems(
  items: NavItem[],
  userRole: string | undefined,
): NavItem[] {
  return items
    .filter((item) => isAllowed(item.roles, userRole))
    .map((item) => {
      // Jika item punya sub-items (NavCollapsible), filter juga sub-itemnya
      if (item.items) {
        return { ...item, items: filterItems(item.items, userRole) };
      }
      return item;
    });
}

export function AppSidebar() {
  const { collapsible, variant } = useLayout();

  // Ambil session & active organization role via Better Auth client hooks
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();

  // Cari role user di organizasi aktif berdasarkan userId
  const userId = session?.user?.id;
  const userRole = activeOrg?.members?.find((m) => m.userId === userId)?.role;

  // Filter navGroups berdasarkan role user:
  // 1. Cek apakah group itu sendiri diperbolehkan untuk role ini
  // 2. Filter item-item di dalam group
  const visibleNavGroups = sidebarData.navGroups
    .filter((group) => isAllowed(group.roles, userRole))
    .map((group) => ({
      ...group,
      items: filterItems(group.items, userRole),
    }))
    // Hapus group yang item-nya sudah habis terfilter
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      {/* ================= HEADER ================= */}
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
      <SidebarContent>
        {visibleNavGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      {/* ================= COLLAPSE RAIL ================= */}
      <SidebarRail />
    </Sidebar>
  );
}
