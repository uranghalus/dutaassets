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
import { TeamSwitcher } from './team-switcher'
import { sidebarData } from '@/config/sidebar-data'
// import { AppTitle } from './app-title'

export function AppSidebar() {
    const { collapsible, variant } = useLayout()

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            {/* HEADER */}
            <SidebarHeader>
                <TeamSwitcher teams={sidebarData.teams} />

                {/* 
          Gunakan ini jika TIDAK pakai organization / team
          <AppTitle /> 
        */}
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent>
                {sidebarData.navGroups.map((group) => (
                    <NavGroup key={group.title} {...group} />
                ))}
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            {/* COLLAPSE RAIL */}
            <SidebarRail />
        </Sidebar>
    )
}
