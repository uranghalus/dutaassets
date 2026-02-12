import { Main } from "@/components/main";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/action/dashboard-action";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertTriangle,
  Package,
  History,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const {
    assets,
    pendingRequisitions,
    lowStockCount,
    recentLogs,
    lowStockItems,
  } = await getDashboardStats();

  return (
    <Main fluid>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground italic">
            Ringkasan operasional untuk organisasi{" "}
            {session.session.activeOrganizationId}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Aset"
            value={assets.TOTAL.toString()}
            description="Aset terdaftar"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
          />
          <SummaryCard
            title="Aset Tersedia"
            value={assets.AVAILABLE.toString()}
            description="Siap untuk dipinjam"
            icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
            trend="+12%" // Placeholder for now
          />
          <SummaryCard
            title="Perlu Persetujuan"
            value={pendingRequisitions.toString()}
            description="Permintaan barang pending"
            icon={<Clock className="h-4 w-4 text-orange-500" />}
            highlight={pendingRequisitions > 0}
          />
          <SummaryCard
            title="Stok Menipis"
            value={lowStockCount.toString()}
            description="Di bawah batas minimum"
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            highlight={lowStockCount > 0}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          {/* Recent Activity Feed */}
          <Card className="md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>Data dari audit log otomatis</CardDescription>
              </div>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {recentLogs.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-10">
                      Belum ada aktivitas
                    </p>
                  ) : (
                    recentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex gap-4 border-l-2 border-primary/20 pl-4 py-1"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">
                              {log.user?.name || "System"}
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(new Date(log.createdAt), {
                                addSuffix: true,
                                locale: id,
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <Badge
                              variant="outline"
                              className="mr-1 py-0 px-1 text-[10px] uppercase"
                            >
                              {log.action}
                            </Badge>
                            {log.entityType}: {log.entityId}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <div className="mt-4">
                <Link
                  href="/audit-logs"
                  className="text-xs text-primary font-medium flex items-center hover:underline"
                >
                  Lihat Semua Audit Logs <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Stok Kritis</CardTitle>
              <CardDescription>
                Barang yang harus segera di-restock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <CheckCircle2 className="h-10 w-10 text-green-500/20 mb-2" />
                    <p className="text-sm italic">Semua stok aman</p>
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Kode: {item.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">
                          {item.totalStock} {item.unit}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Min: {item.minStock}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}

/* =========================
   UI COMPONENTS
 ========================= */

function SummaryCard({
  title,
  value,
  description,
  icon,
  highlight,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  trend?: string;
}) {
  return (
    <Card
      className={`overflow-hidden ${highlight ? "border-primary ring-1 ring-primary/20 bg-primary/5" : ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <span className="text-[10px] font-medium text-green-600">
              {trend}
            </span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
