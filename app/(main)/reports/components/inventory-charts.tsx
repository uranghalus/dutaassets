"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useInventoryReport } from "@/hooks/use-reports";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

export function InventoryCharts() {
  const { data: invData, isLoading } = useInventoryReport();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[350px] w-full" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Value by Warehouse */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Value by Warehouse</CardTitle>
          <CardDescription>
            Total valuation of stock across different locations
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={invData?.warehouseSummary} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp ${value / 1000000}jt`}
              />
              <YAxis
                dataKey="name"
                type="category"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value: any) => [
                  `Rp ${Number(value).toLocaleString()}`,
                  "Value",
                ]}
              />
              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[0, 4, 4, 0]}
                barSize={30}
              >
                {invData?.warehouseSummary.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Items by Quantity */}
      <Card>
        <CardHeader>
          <CardTitle>Top Stocked Items</CardTitle>
          <CardDescription>
            Items with the highest quantity in inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={invData?.topItems}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="quantity"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
