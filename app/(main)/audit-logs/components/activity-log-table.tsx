"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableViewOptions } from "@/components/datatable/datatable-view-options";

import { useDataTable } from "@/hooks/use-data-table";
import { useActivityLogs } from "@/hooks/use-activity-log";
import { activityLogColumns } from "./activity-log-columns";
import { ActivityLogFilter } from "./activity-log-filter";
import { AuditLog, User } from "@/generated/prisma/client";

export function ActivityLogTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [action, setAction] = useState("");
  const [model, setModel] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data, isLoading } = useActivityLogs({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    action: action || undefined,
    model: model || undefined,
    dateFrom: dateRange?.from?.toISOString(),
    dateTo: dateRange?.to?.toISOString(),
  });

  const { table } = useDataTable({
    data: (data?.data ?? []) as (AuditLog & { user: User | null })[],
    columns: activityLogColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  const handleActionChange = (value: string) => {
    setAction(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleDateRangeChange = (value: DateRange | undefined) => {
    setDateRange(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleReset = () => {
    setAction("");
    setModel("");
    setDateRange(undefined);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="p-3 rounded-md border space-y-4">
      <div className="flex items-center justify-between">
        <ActivityLogFilter
          action={action}
          model={model}
          dateRange={dateRange}
          onActionChange={handleActionChange}
          onModelChange={handleModelChange}
          onDateRangeChange={handleDateRangeChange}
          onReset={handleReset}
        />

        <DataTableViewOptions table={table} />
      </div>

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
