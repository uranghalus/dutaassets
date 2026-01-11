/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

type Props = {
    data: {
        id: string
        name: string
        slug: string
        createdAt: string
        members: any[]
    }
}


export function OrganizationOverview({
    data,
}: Props) {
    const owner = data.members.find((m) => m.role === 'owner')

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {/* INFO */}
            <Card>
                <CardHeader>
                    <CardTitle>Organization Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <div className="text-muted-foreground">Name</div>
                        <div className="font-medium">{data.name}</div>
                    </div>

                    <div>
                        <div className="text-muted-foreground">Slug</div>
                        <div className="font-medium">{data.slug}</div>
                    </div>

                    <div>
                        <div className="text-muted-foreground">Created At</div>
                        <div className="font-medium">
                            {format(new Date(data.createdAt), 'dd MMM yyyy')}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* META */}
            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Members</span>
                        <Badge>{data.members.length}</Badge>
                    </div>

                    {owner && (
                        <div>
                            <div className="text-muted-foreground">Owner</div>
                            <div className="font-medium">{owner.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                                {owner.user.email}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
