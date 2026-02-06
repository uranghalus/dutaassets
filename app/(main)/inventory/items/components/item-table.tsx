/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { itemColumns } from "./item-columns";
import { useItems } from "@/hooks/use-item";

import { ItemBulkActions } from "./item-bulk-actions";
import { Item } from "@/generated/prisma/client";

export function ItemTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useItems({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as Item[],
    columns: itemColumns,
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
        searchPlaceholder="Search item..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />

      <ItemBulkActions table={table} />
    </div>
  );
}
