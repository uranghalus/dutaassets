/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { warehouseColumns } from "./warehouse-columns";
import { useWarehouses } from "@/hooks/use-warehouse";

import { WarehouseBulkActions } from "./warehouse-bulk-actions";
import { Warehouse } from "@/generated/prisma/client";

export function WarehouseTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useWarehouses({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as Warehouse[],
    columns: warehouseColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="name"
        searchPlaceholder="Search warehouse..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />

      <WarehouseBulkActions table={table} />
    </div>
  );
}
