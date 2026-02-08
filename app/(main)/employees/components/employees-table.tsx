/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { useEmployees } from "@/hooks/use-employee";

import { EmployeeBulkActions } from "./employees-bulk-action";
import { employeesColumns } from "./employees-column";
import { EmployeeWithDivisi } from "@/types/employee";
import { useDivisionOptions } from "@/hooks/use-divisions";

export function EmployeeTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useEmployees({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { data: divisions = [] } = useDivisionOptions();

  const { table } = useDataTable({
    data: (data?.data ?? []) as any,
    columns: employeesColumns,
    columnResizeMode: "onEnd",
    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="nama"
        searchPlaceholder="Search employee..."
        filters={[
          {
            columnId: "divisi", // ✅ HARUS SAMA
            title: "Divisi",
            options: divisions.map((div) => ({
              label: div.nama_divisi,
              value: div.nama_divisi, // ✅ MATCH accessorFn
            })),
          },
        ]}
      />

      <DataTable table={table} loading={isLoading} />
      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
      <EmployeeBulkActions table={table} />
    </div>
  );
}
