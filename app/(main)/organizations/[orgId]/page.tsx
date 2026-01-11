
import { Main } from '@/components/main'
import OrgOverviewCard from './components/org-overview-card'

type PageProps = {
    params: {
        orgId: string
    }
}
export default async function OrganizationDetailClient({ params }: PageProps) {
    const { orgId } = await params
    return (
        <Main fluid className='space-y-6'>
            <div>
                <h1 className="text-2xl font-semibold">
                    Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                    asdasdas
                </p>
            </div>
            <OrgOverviewCard orgId={orgId} />
        </Main>
    )
}
