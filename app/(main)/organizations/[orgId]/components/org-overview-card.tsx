/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useOrganizationDetail } from "@/hooks/use-organization"
import { OrganizationTabs } from "./organization-tabs"

type Props = {
    orgId: string
}
export default function OrgOverviewCard({ orgId }: Props) {
    console.log(orgId);

    const { data, isLoading, error } = useOrganizationDetail({
        organizationId: orgId,
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load organization</div>

    return (
        <OrganizationTabs data={data as any} />
    )
}
