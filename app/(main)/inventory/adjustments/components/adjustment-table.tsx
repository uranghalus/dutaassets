"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { useStockAdjustments } from "@/hooks/use-stock-adjustment";
import { adjustmentColumns } from "./adjustment-columns";
import {
  StockAdjustment,
  Warehouse,
  StockAdjustmentItem,
} from "@/generated/prisma/client";

type StockAdjustmentWithRelations = StockAdjustment & {
  warehouse: Warehouse;
  items: StockAdjustmentItem[];
};

export function AdjustmentTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useStockAdjustments({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as StockAdjustmentWithRelations[],
    columns: adjustmentColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="reason"
        searchPlaceholder="Search reason..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
