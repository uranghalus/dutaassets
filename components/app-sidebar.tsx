/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { filterNavItems } from '@/lib/filter-sidebardata'
import { sidebarData } from '@/config/sidebar-data'

// import { AppTitle } from './app-title'

export function AppSidebar() {
    const { collapsible, variant } = useLayout()
    const { data: session } = authClient.useSession()
    const [navGroups, setNavGroups] = useState<any[]>([]);

    const isAdmin = (session?.user?.role === 'admin') ? true : false;
    const hasOrg = Boolean(session?.session.activeOrganizationId);
    useEffect(() => {
        const run = async () => {
            const groups = [];

            for (const group of sidebarData.navGroups) {
                const items = await filterNavItems(
                    group.items,
                    isAdmin,
                    hasOrg
                );

                if (items.length > 0) {
                    groups.push({ ...group, items });
                }
            }

            setNavGroups(groups);
        };

        run();
    }, [isAdmin, hasOrg]);
    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            {/* === Header Section === */}
            <SidebarHeader>
                {/* Jika kamu ingin dropdown tim */}
                <TeamSwitcher teams={sidebarData.teams} />

                {/* Jika ingin pakai judul aplikasi biasa: */}
                {/* <AppTitle /> */}
            </SidebarHeader>

            {/* === Navigasi === */}
            <SidebarContent>
                {navGroups.map((group) => (
                    <NavGroup key={group.title} {...group} />
                ))}
            </SidebarContent>

            {/* === Footer (User Info) === */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            {/* === Sidebar Rail (untuk mode collapsed) === */}
            <SidebarRail />
        </Sidebar>
    )
}
