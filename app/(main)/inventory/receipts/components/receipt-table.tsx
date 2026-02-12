"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { useStockReceipts } from "@/hooks/use-stock-receipt";
import { receiptColumns } from "./receipt-columns";
import {
  StockReceipt,
  Warehouse,
  StockReceiptItem,
} from "@/generated/prisma/client";

type StockReceiptWithRelations = StockReceipt & {
  warehouse: Warehouse;
  items: StockReceiptItem[];
};

export function ReceiptTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useStockReceipts({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as StockReceiptWithRelations[],
    columns: receiptColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="vendorName"
        searchPlaceholder="Search vendor..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
