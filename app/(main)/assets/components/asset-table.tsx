"use client";

import { useAssets } from "@/hooks/use-asset";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";
import { assetColumns } from "./asset-columns";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { Asset, Department } from "@/generated/prisma/client";

export function AssetTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");

  const { data, isLoading } = useAssets({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search: search,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as (Asset & { department_fk: Department })[],
    columns: assetColumns,
    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4 p-3 rounded-md border">
      {/* Simplified search */}
      <div className="flex items-center gap-2">
        <input
          placeholder="Search code, name, brand..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* 
        Ideally use DataTableToolbar but it's tied to specific column "filter".
        Here we have a global search across multiple fields (handled in server).
      */}

      <DataTable table={table} loading={isLoading} />
      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
