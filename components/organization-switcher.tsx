'use client'

import { useEffect } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

import { authClient } from '@/lib/auth-client'
import { useOrganizationActiveMutation, useOrganizationListQuery } from '@/hooks/use-switcher'

export function OrganizationSwitcher() {
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const { data: organizations = [], isLoading } = useOrganizationListQuery()
    const { mutate, isPending } = useOrganizationActiveMutation()

    // Auto-set active organization if none selected
    useEffect(() => {
        if (!isLoading && !activeOrganization && organizations.length > 0) {
            mutate({ organizationId: organizations[0].id })
        }
    }, [isLoading, activeOrganization, organizations, mutate])

    // Fallback to first organization if active is missing but list is available
    const effectiveOrganization = activeOrganization || organizations[0]

    // LOADING STATE (Only if we truly have no data to show)
    if (isLoading || (!effectiveOrganization && organizations.length === 0)) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" disabled>
                        <Skeleton className="size-8 rounded-lg" />
                        <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="size-4 rounded-sm ml-auto opacity-50" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    // MAIN RENDER (All users can switch)
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            disabled={isPending}
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                {effectiveOrganization.name.charAt(0)}
                            </div>

                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {effectiveOrganization.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {effectiveOrganization.slug}
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
                                disabled={org.id === effectiveOrganization.id}
                                onClick={() =>
                                    mutate({
                                        organizationId: org.id,
                                    })
                                }
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
    )
}
