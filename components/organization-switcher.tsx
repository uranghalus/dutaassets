/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ChevronsUpDown, Plus } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

import { useOrganizationOptions } from '@/hooks/use-organization'

import { authClient } from '@/lib/auth-client'
import { switchOrganizationAdminOnly } from '@/lib/switch-organization'

export function OrganizationSwitcher() {
    const { isMobile } = useSidebar()
    const { data: organizations = [] } = useOrganizationOptions()
    const { data: activeOrganization } = authClient.useActiveOrganization()

    if (!activeOrganization) return null

    const handleSwitch = async (org: {
        id: string
        slug: string
    }) => {
        try {
            await switchOrganizationAdminOnly(org.id, org.slug)
            window.location.reload() // 🔥 sync sidebar + data
        } catch (err) {
            console.error(err)
            alert('You are not allowed to switch organization')
        }
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                {activeOrganization.name[0]}
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

                    <DropdownMenuContent
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                        className="min-w-56 rounded-lg"
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Organizations
                        </DropdownMenuLabel>

                        {organizations.map((org: any) => (
                            <DropdownMenuItem
                                key={org.id}
                                onClick={() => handleSwitch(org)}
                                className="cursor-pointer"
                            >
                                <span className="font-medium">{org.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                    {org.slug}
                                </span>
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Plus className="size-4" />
                            <span>Add Organization</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
