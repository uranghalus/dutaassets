"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { useRequisitions } from "@/hooks/use-requisition";
import { requisitionColumns } from "./requisition-columns";
import {
  Requisition,
  Karyawan,
  RequisitionItem,
  Item,
} from "@/generated/prisma/client";

type RequisitionWithRelations = Requisition & {
  requester: Karyawan;
  items: (RequisitionItem & { item: Item })[];
};

export function RequisitionTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useRequisitions({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as RequisitionWithRelations[],
    columns: requisitionColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="requester" // Searching by requester name might require generic toolbar update or flatter data, but let's try. Actually searchKey usually filters specific column.
        searchPlaceholder="Filter items..." // Default text
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
