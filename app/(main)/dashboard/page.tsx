import { Main } from '@/components/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { getServerSession } from '@/lib/get-session'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const session = await getServerSession()

    if (!session) {
        redirect('/login')
    }

    const role = session.user.role // asumsi sudah ada dari better-auth

    return (
        <Main fluid>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Selamat datang, {session.user.email}
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard title="Total APAR" value="128" />
                    <SummaryCard title="Total Hydrant" value="32" />
                    <SummaryCard title="Inspeksi Bulan Ini" value="56" />

                    {(role === 'manager' || role === 'superadmin') && (
                        <SummaryCard
                            title="Pending Approval"
                            value="7"
                            highlight
                        />
                    )}
                </div>

                {/* Role-based Section */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Inspector / Manager */}
                    {(role === 'inspector' || role === 'manager') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tugas Inspeksi</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Anda memiliki inspeksi yang perlu dilakukan hari ini.
                            </CardContent>
                        </Card>
                    )}

                    {/* General Manager */}
                    {role === 'general_manager' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Laporan Ringkas</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Lihat laporan inspeksi terbaru tanpa melakukan perubahan data.
                            </CardContent>
                        </Card>
                    )}

                    {/* Admin */}
                    {role === 'admin' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Master Data</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Kelola data APAR, Hydrant, dan Checkpoint.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </Main>
    )
}

/* =========================
   COMPONENT KECIL
========================= */

function SummaryCard({
    title,
    value,
    highlight,
}: {
    title: string
    value: string
    highlight?: boolean
}) {
    return (
        <Card className={highlight ? 'border-red-500' : ''}>
            <CardHeader>
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">
                    {value}
                </p>
            </CardContent>
        </Card>
    )
}
