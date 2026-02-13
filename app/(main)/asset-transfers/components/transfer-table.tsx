"use client";

import { useAssetTransfers } from "@/hooks/use-asset-transfer";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";
import { transferColumns } from "./transfer-columns";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { TransferWithRelations } from "./transfer-dialog-provider";

export function TransferTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { data, isLoading } = useAssetTransfers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: search,
    status: status,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as TransferWithRelations[],
    columns: transferColumns,
    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4 p-3 rounded-md border">
      <div className="flex flex-wrap items-center gap-2">
        <input
          placeholder="Search asset..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={status || ""}
          onChange={(e) => setStatus(e.target.value || undefined)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <DataTable table={table} loading={isLoading} />
      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
