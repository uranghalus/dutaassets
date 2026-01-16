'use client'

import { useLayout } from '@/context/layout-provider'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'

import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { OrganizationSwitcher } from '@/components/organization-switcher'

import { sidebarData } from '@/config/sidebar-data'

export function AppSidebar() {
    const { collapsible, variant } = useLayout()

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            {/* ================= HEADER ================= */}
            <SidebarHeader>
                <OrganizationSwitcher />
            </SidebarHeader>

            {/* ================= CONTENT ================= */}
            <SidebarContent>
                {sidebarData.navGroups.map((group) => (
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
    )
}
