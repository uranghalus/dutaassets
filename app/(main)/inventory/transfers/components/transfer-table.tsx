"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { useStockTransfers } from "@/hooks/use-stock-transfer";
import { transferColumns } from "./transfer-columns";
import {
  StockTransfer,
  Warehouse,
  StockTransferItem,
} from "@/generated/prisma/client";

type StockTransferWithRelations = StockTransfer & {
  fromWarehouse: Warehouse;
  toWarehouse: Warehouse;
  items: StockTransferItem[];
};

export function TransferTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useStockTransfers({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as StockTransferWithRelations[],
    columns: transferColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="remarks"
        searchPlaceholder="Search remarks..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
