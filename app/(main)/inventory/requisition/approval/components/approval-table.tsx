"use client";

import { useApprovalRequisitions } from "@/hooks/use-requisition";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";
import { approvalColumns } from "./approval-columns";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { RequisitionWithRelations } from "./approval-dialog-provider";

export function ApprovalTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("PENDING_APPROVAL");

  const { data, isLoading } = useApprovalRequisitions({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: search,
    status: status,
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as RequisitionWithRelations[],
    columns: approvalColumns,
    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4 p-3 rounded-md border">
      <div className="flex flex-wrap items-center gap-2">
        <input
          placeholder="Search by ID or requester..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PENDING_APPROVAL">Pending Approval (All)</option>
          <option value="PENDING_SUPERVISOR">Supervisor Action</option>
          <option value="PENDING_FA">FA Manager Action</option>
          <option value="PENDING_GM">GM Action</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <DataTable table={table} loading={isLoading} />
      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
