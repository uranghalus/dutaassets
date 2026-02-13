"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, Package, Wrench, Wallet } from "lucide-react";
import {
  useAssetReport,
  useMaintenanceReport,
  useInventoryReport,
} from "@/hooks/use-reports";
import { Skeleton } from "@/components/ui/skeleton";

export function ReportCards() {
  const { data: assetData, isLoading: assetLoading } = useAssetReport();
  const { data: maintData, isLoading: maintLoading } = useMaintenanceReport();
  const { data: invData, isLoading: invLoading } = useInventoryReport();

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const cards = [
    {
      title: "Total Asset Value",
      value: formatter.format(assetData?.totalValue || 0),
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-100",
      loading: assetLoading,
    },
    {
      title: "Total Assets",
      value: assetData?.totalCount || 0,
      icon: Boxes,
      color: "text-purple-600",
      bg: "bg-purple-100",
      loading: assetLoading,
    },
    {
      title: "Inventory Value",
      value: formatter.format(invData?.totalInventoryValue || 0),
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-100",
      loading: invLoading,
    },
    {
      title: "Maintenance Costs",
      value: formatter.format(maintData?.totalMaintenanceCost || 0),
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-100",
      loading: maintLoading,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-md ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {card.loading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <div className="text-2xl font-bold">{card.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
