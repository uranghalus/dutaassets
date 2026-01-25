'use client'

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

import { authClient } from '@/lib/auth-client'


import { useOrganizationActiveMutation, useOrganizationListQuery } from '@/hooks/use-switcher'

export function OrganizationSwitcher() {
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const { data: organizations = [], isLoading } = useOrganizationListQuery()
    const { mutate, isPending } = useOrganizationActiveMutation()

    if (isLoading) return null

    const isAdmin =
        activeOrganization?.members[0].role === 'owner' ||
        activeOrganization?.members[0].role === 'admin'

    // 🔒 MEMBER → READ ONLY
    if (!isAdmin) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            {activeOrganization?.name.charAt(0)}
                        </div>
                        <div className="grid flex-1 text-start text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {activeOrganization?.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {activeOrganization?.slug}
                            </span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    // 🔓 OWNER / ADMIN
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" disabled={isPending}>
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

                            <ChevronsUpDown className="ms-auto size-4 opacity-60" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="min-w-56">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Organizations
                        </DropdownMenuLabel>

                        {organizations.map((org) => (
                            <DropdownMenuItem
                                key={org.id}
                                disabled={org.id === activeOrganization.id}
                                onClick={() =>
                                    mutate({
                                        organizationId: org.id,
                                    })
                                }
                            >
                                <span className="font-medium">{org.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">
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
