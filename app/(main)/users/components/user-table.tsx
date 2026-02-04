'use client'

import { useState } from 'react'

import { DataTable } from '@/components/datatable/data-table'
import { DataTablePagination } from '@/components/datatable/datatable-pagination'
import { DataTableToolbar } from '@/components/datatable/datatable-toolbar'

import { useDataTable } from '@/hooks/use-data-table'
import { useUsers } from '@/hooks/use-users'
import { userColumns } from './user-columns'

export function UserTable() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // Search state managed by table or separate? 
    // `useDataTable` usually handles column filters.
    // But our API `getUsers` takes `search`.
    // Let's pass a search string if we have one.
    // For now, simple pagination.

    const { data, isLoading } = useUsers({
        page: pagination.pageIndex + 1, // API is 1-indexed usually? check action. Action calc: (page - 1) * pageSize. So 1-indexed input.
        pageSize: pagination.pageSize,
    })

    const { table } = useDataTable({
        data: data?.data ?? [],
        columns: userColumns,
        columnResizeMode: 'onEnd',
        pageCount: data?.pageCount ?? 0,
        pagination,
        onPaginationChange: setPagination,
    })

    return (
        <div className="p-3 rounded-md border space-y-4">
            <DataTableToolbar
                table={table}
                searchKey="name"
                searchPlaceholder="Search users..."
            />

            <DataTable table={table} loading={isLoading} />
            <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
        </div>
    )
}
