'use client'

import { OrganizationProvider } from "@/context/organization-provider"
import { useOrganizationOptions } from "@/hooks/use-organization"



export function OrganizationProviderClient({
    children,
}: {
    children: React.ReactNode
}) {
    const { data = [], isLoading } = useOrganizationOptions()

    return (
        <OrganizationProvider
            organizations={data}
            isLoading={isLoading}
        >
            {children}
        </OrganizationProvider>
    )
}
