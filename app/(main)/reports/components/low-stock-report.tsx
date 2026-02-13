"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLowStockReport } from "@/hooks/use-low-stock";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LowStockReport() {
  const { data, isLoading } = useLowStockReport();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
        <CardContent className="flex flex-col items-center justify-center py-10 text-green-600 dark:text-green-400">
          <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
          <p className="text-sm font-medium">
            All stock levels are currently above minimum requirements.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Critical Stock Levels
            </CardTitle>
            <CardDescription>
              Items that have fallen below their defined minimum stock
              threshold.
            </CardDescription>
          </div>
          <Badge variant="destructive" className="h-6">
            {data.length} Alerts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Min. Stock</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {item.warehouseDetails
                      .map((w) => `${w.warehouseName}: ${w.quantity}`)
                      .join(", ")}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{item.code}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {item.itemCategory?.name || "Uncategorized"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-red-600">
                    {item.totalStock} {item.unit}
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {item.minStock} {item.unit}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1"
                  >
                    <Link href="/inventory/requisitions">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Restock
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
