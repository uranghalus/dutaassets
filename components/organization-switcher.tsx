"use client";

import { ChevronsUpDown } from "lucide-react";
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
import { useOrganizationListQuery } from "@/hooks/use-switcher";

export function OrganizationSwitcher() {
  const { data: session } = authClient.useSession();
  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();

  // Optional: hanya untuk IT / Super Admin multi-org
  const { data: organizations = [] } = useOrganizationListQuery();

  if (isPending || !activeOrganization) {
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

  const role = session?.user?.role;

  // 🔐 ERP Rule:
  // Hanya super_admin / owner global yang boleh switch
  const canSwitch = role === "super_admin";

  if (!canSwitch) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
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

              <ChevronsUpDown className="ml-auto size-4" />
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
                disabled={org.id === activeOrganization.id}
                onClick={() => {
                  // hanya super_admin yang boleh
                  // nanti panggil server action setActiveOrganization()
                }}
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