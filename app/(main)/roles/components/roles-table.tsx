/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { roleColumns } from "./roles-column";
import { useOrgRoles } from "@/hooks/use-organization-role";

import { RolesBulkActions } from "./roles-bulk-actions";

export function RolesTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useOrgRoles({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns: roleColumns as any,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="role"
        searchPlaceholder="Search role..."
        filters={[
          {
            columnId: "role",
            title: "Role",
            options: [
              { label: "Admin", value: "admin" },
              { label: "Member", value: "member" },
              { label: "Owner", value: "owner" },
            ],
          },
        ]}
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />

      <RolesBulkActions table={table} />
    </div>
  );
}
