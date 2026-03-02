"use client";

import { ChevronsUpDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { authClient } from "@/lib/auth-client";
import {
  useOrganizationListQuery,
  useOrganizationActiveMutation,
} from "@/hooks/use-switcher";
import {
  setActiveOrganizationAction,
  getActiveOrganizationWithRole,
} from "@/action/organization-action";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export function OrganizationSwitcher() {
  const { data: session } = authClient.useSession();
  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();

  // Fetch the role explicitly defined in the DB for the current user
  const { data: orgMemberData, isLoading: isLoadingRole } = useQuery({
    queryKey: ["active-org-role", activeOrganization?.id],
    queryFn: async () => {
      // getActiveOrganizationWithRole checks DB
      const result = await getActiveOrganizationWithRole();
      return result;
    },
    enabled: !!activeOrganization?.id,
  });

  const { data: organizations = [] } = useOrganizationListQuery();
  const { mutate: setActive, isPending: isSwitching } =
    useOrganizationActiveMutation();

  if (isPending || isLoadingRole || !activeOrganization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const globalRole = (session?.user as { role?: string } | undefined)?.role;

  // 🔐 ERP Rule:
  // - super_admin (global user role) → boleh switch ke org manapun
  // - owner (org member role) → boleh switch
  // - Selain itu → hanya bisa melihat org yg ditetapkan HRD (read-only)
  const isGlobalSuperAdmin = globalRole === "super_admin";
  const isOrgOwner = orgMemberData?.role === "owner";

  const canSwitch = isGlobalSuperAdmin || isOrgOwner;

  // ─── Read-only display for non-privileged users ───────────────────────────
  if (!canSwitch) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-default">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              {activeOrganization.name.charAt(0)}
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-semibold">
                {activeOrganization.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {activeOrganization.slug}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // ─── Privileged users: dropdown switcher ─────────────────────────────────
  async function handleSwitch(organizationId: string) {
    if (organizationId === activeOrganization?.id) return;
    try {
      await setActiveOrganizationAction(organizationId);
      setActive({ organizationId });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal berpindah organisasi",
      );
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              disabled={isSwitching}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                {activeOrganization.name.charAt(0)}
              </div>

              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrganization.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeOrganization.slug}
                </span>
              </div>

              {isSwitching ? (
                <Loader2 className="ml-auto size-4 animate-spin" />
              ) : (
                <ChevronsUpDown className="ml-auto size-4" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>

            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                disabled={org.id === activeOrganization.id || isSwitching}
                onClick={() => handleSwitch(org.id)}
                className="gap-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border text-xs font-medium">
                  {org.name.charAt(0)}
                </div>
                <span className="font-medium flex-1">{org.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                  {org.slug}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
