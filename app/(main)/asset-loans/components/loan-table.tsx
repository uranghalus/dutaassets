"use client";

import { useAssetLoans } from "@/hooks/use-asset-loan";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";
import { loanColumns } from "./loan-columns";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { Asset, AssetLoan, Karyawan } from "@/generated/prisma/client";

type LoanWithRelations = AssetLoan & {
  asset: Asset;
  employee: Karyawan;
};

export function LoanTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");

  const { data, isLoading } = useAssetLoans({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: search,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as LoanWithRelations[],
    columns: loanColumns,
    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4 p-3 rounded-md border">
      <div className="flex items-center gap-2">
        <input
          placeholder="Search asset or employee..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable table={table} loading={isLoading} />
      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
