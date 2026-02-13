"use client";

import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import { historyColumns } from "./history-columns";
import { useAssetHistory } from "@/hooks/use-asset-history";
import { AssetHistoryItem } from "@/action/asset-history-action";

export function HistoryTable({
  assetId,
  search,
}: {
  assetId?: string;
  search?: string;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useAssetHistory({
    assetId,
    search,
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as AssetHistoryItem[],
    columns: historyColumns,
    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4">
      <DataTable table={table} loading={isLoading} />
      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
