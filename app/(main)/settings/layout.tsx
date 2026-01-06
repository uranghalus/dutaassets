import { Main } from '@/components/main';
import { Separator } from '@/components/ui/separator';
import { UserCog, Wrench, Palette, Bell, Monitor } from 'lucide-react';
import React, { ReactNode } from 'react'
import { SidebarNav } from './components/sidebarnav';
const sidebarNavItems = [
    {
        title: "Profile",
        href: "/settings/profile",
        icon: <UserCog size={18} />,
    },
    {
        title: "Account",
        href: "/settings/account",
        icon: <Wrench size={18} />,
    },
    // {
    //     title: "Appearance",
    //     href: "/settings/appearance",
    //     icon: <Palette size={18} />,
    // },
    // {
    //     title: "Notifications",
    //     href: "/settings/notifications",
    //     icon: <Bell size={18} />,
    // },
    // {
    //     title: "Display",
    //     href: "/settings/display",
    //     icon: <Monitor size={18} />,
    // },
];
interface Props {
    children: ReactNode
}
export default function SettingLayout({ children }: Props) {
    return (
        <Main fixed>
            <div className="space-y-0.5">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>

            <Separator className="my-4 lg:my-6" />

            <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="top-0 lg:sticky lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>

                {/* ===== Content replaces <Outlet /> ===== */}
                <div className="flex w-full overflow-y-hidden p-1">
                    {children}
                </div>
            </div>
        </Main>
    )
}
