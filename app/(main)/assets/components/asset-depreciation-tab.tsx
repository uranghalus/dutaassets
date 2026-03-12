"use client";

import { useState, useTransition } from "react";
import {
  calculateDepreciation,
  saveDepreciationSchedule,
  getAssetDepreciationSchedule,
} from "@/action/depreciation-action";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange, Calculator, Save } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Asset } from "@/generated/prisma/client";
import { AssetWithRelations } from "./asset-dialog-provider";

interface AssetDepreciationTabProps {
  asset: AssetWithRelations;
  initialSchedule: any[];
}

export function AssetDepreciationTab({
  asset,
  initialSchedule,
}: AssetDepreciationTabProps) {
  const [schedule, setSchedule] = useState<any[]>(initialSchedule);
  const [isPending, startTransition] = useTransition();

  const handleCalculate = async () => {
    startTransition(async () => {
      try {
        const generated = await calculateDepreciation(asset.id_barang);
        setSchedule(generated);
        toast.success("Schedule calculated! Review and save to apply.");
      } catch (error: any) {
        toast.error(error.message || "Failed to calculate depreciation.");
      }
    });
  };

  const handleSave = async () => {
    startTransition(async () => {
      try {
        await saveDepreciationSchedule(asset.id_barang, schedule);
        toast.success("Depreciation schedule saved successfully.");
      } catch (error: any) {
        toast.error("Failed to save schedule.");
      }
    });
  };

  const hasMissingValues = !asset.item?.purchaseValue || !asset.usefulLifeYears;

  const formatCurrency = (amount: number | string) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(amount));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Depreciation Schedule (Straight-Line)
          </CardTitle>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCalculate}
              disabled={isPending || hasMissingValues}
              className="gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculate
            </Button>
            {schedule.length > 0 && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Schedule
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasMissingValues && (
            <div className="bg-orange-50 text-orange-800 p-4 rounded-md mb-4 text-sm border border-orange-200">
              Please enter Purchase Value and Useful Life (Years) in the asset
              details to calculate depreciation.
            </div>
          )}

          {schedule.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
              <CalendarRange className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
              <p>No depreciation schedule generated yet.</p>
              <p className="text-sm mt-1">
                Click Calculate to generate a straight-line depreciation table.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Year</TableHead>
                    <TableHead>Period Ending</TableHead>
                    <TableHead className="text-right">
                      Est. Depreciation
                    </TableHead>
                    <TableHead className="text-right">
                      Accumulated Dep.
                    </TableHead>
                    <TableHead className="text-right">Net Book Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {format(new Date(row.periodDate), "PPP")}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        - {formatCurrency(row.depreciationAmt)}
                      </TableCell>
                      <TableCell className="text-right text-orange-600">
                        {formatCurrency(row.accumulatedDep)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(row.netBookValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Values Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col justify-center text-center">
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
              Purchase Value
            </span>
            <span className="text-xl font-bold">
              {asset.item?.purchaseValue
                ? formatCurrency(Number(asset.item?.purchaseValue))
                : "-"}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col justify-center text-center">
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
              Salvage Value
            </span>
            <span className="text-xl font-bold">
              {asset.salvageValue
                ? formatCurrency(Number(asset.salvageValue))
                : "-"}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col justify-center text-center">
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
              Useful Life
            </span>
            <span className="text-xl font-bold">
              {asset.usefulLifeYears ? `${asset.usefulLifeYears} Years` : "-"}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
