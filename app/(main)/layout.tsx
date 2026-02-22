import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Header } from '@/components/header'
import { ThemeSwitch } from '@/components/theme-switcher'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { AppSidebar } from '@/components/app-sidebar'

import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'

import {
    SidebarInset,
    SidebarProvider,
} from '@/components/ui/sidebar'

import { cn } from '@/lib/utils'
import { getServerSession } from '@/lib/get-session'
import { ThemeProvider } from '@/context/theme-provider'
import { syncUserOrganization } from '@/action/organization-action'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const sidebarState = cookieStore.get('sidebar_state')?.value
    const defaultOpen = sidebarState !== 'false'
    const session = await getServerSession()
    if (!session) redirect('/')
    await syncUserOrganization();

    return (
        <ThemeProvider>
            <SearchProvider>
                <LayoutProvider>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <AppSidebar />

                        <SidebarInset
                            className={cn(
                                '@container/content',
                                'has-[[data-layout=fixed]]:h-svh',
                                'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
                            )}
                        >
                            <Header>
                                <div className="ms-auto flex items-center space-x-4">
                                    <ThemeSwitch />
                                    <ProfileDropdown />
                                </div>
                            </Header>

                            {children}
                        </SidebarInset>
                    </SidebarProvider>
                </LayoutProvider>
            </SearchProvider>
        </ThemeProvider>
    )
}
