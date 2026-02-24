"use client";

import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useActivityLogs } from "@/hooks/use-activity-log";
import { activityLogColumns } from "../../audit-logs/components/activity-log-columns";
import { ActivityLog, User } from "@/generated/prisma/client";

interface AssetActivityLogTableProps {
    assetId: string;
}

export function AssetActivityLogTable({ assetId }: AssetActivityLogTableProps) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading } = useActivityLogs({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        entityId: assetId,
        entityType: "Asset",
    });

    const { table } = useDataTable({
        data: (data?.data ?? []) as (ActivityLog & { user: User | null })[],
        columns: activityLogColumns,
        columnResizeMode: "onEnd",
        pageCount: data?.pageCount ?? 0,
        pagination,
        onPaginationChange: setPagination,
    });

    return (
        <div className="rounded-md border p-3 space-y-4">
            <DataTableToolbar
                table={table}
                searchKey="action"
                searchPlaceholder="Filter by action..."
            />

            <DataTable table={table} loading={isLoading} />

            <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
        </div>
    );
}
