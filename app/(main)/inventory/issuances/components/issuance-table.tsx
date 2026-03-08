"use client";

import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { issuanceColumns } from "./issuance-columns";
import { useStockIssuances } from "@/hooks/use-stock-issuance";
import {
  StockIssuance,
  Warehouse,
  StockIssuanceItem,
  Item,
} from "@/generated/prisma/client";

type StockIssuanceWithRelations = StockIssuance & {
  warehouse: Warehouse;
  items: (StockIssuanceItem & { item: Item })[];
};

export function IssuanceTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useStockIssuances({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as unknown as StockIssuanceWithRelations[],
    columns: issuanceColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="issuedTo"
        searchPlaceholder="Search issued to..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
