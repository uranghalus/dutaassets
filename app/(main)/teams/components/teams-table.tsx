/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { teamColumns, TeamWithRelations } from "./teams-column";
import { useTeams } from "@/hooks/use-teams";

import { TeamsBulkActions } from "./teams-bulk-actions";

export function TeamsTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useTeams({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as TeamWithRelations[], // Cast purely for consistency
    columns: teamColumns,
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
        searchPlaceholder="Search team..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />

      <TeamsBulkActions table={table} />
    </div>
  );
}
