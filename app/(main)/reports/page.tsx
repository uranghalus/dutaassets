"use client";

import { Header } from "@/components/header";
import { ReportCards } from "./components/report-cards";
import { AssetCharts } from "./components/asset-charts";
import { InventoryCharts } from "./components/inventory-charts";
import { LowStockReport } from "./components/low-stock-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PieChart, BarChart3, AlertTriangle } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-muted-foreground">
            Visual insights into your assets and inventory.
          </p>
        </div>
      </div>

      <ReportCards />

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Asset Analytics
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Inventory Analytics
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Stock Alerts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="assets" className="space-y-4">
          <AssetCharts />
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <InventoryCharts />
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <LowStockReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
