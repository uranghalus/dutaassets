/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

import { DataTable } from '@/components/datatable/data-table'
import { DataTablePagination } from '@/components/datatable/datatable-pagination'
import { DataTableToolbar } from '@/components/datatable/datatable-toolbar'

import { useDataTable } from '@/hooks/use-data-table'
import { useDivisions } from '@/hooks/use-divisions'

import { DivisiBulkActions } from './div-bulk-action'
import { useDepartmentsSimple } from '@/hooks/use-departments'
import { divColumns } from './div-columns'

export function DivisiTable() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, isLoading } = useDivisions({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
    })

    const { data: departments = [] } = useDepartmentsSimple()

    const { table } = useDataTable({
        data: data?.data ?? [],
        columns: divColumns as any,
        columnResizeMode: 'onEnd',

        pageCount: data?.pageCount ?? 0,
        pagination,
        onPaginationChange: setPagination,
    })

    return (
        <div className="p-3 rounded-md border space-y-4">
            <DataTableToolbar
                table={table}
                searchKey="nama_divisi"
                searchPlaceholder="Search divisi..."
                filters={[
                    {
                        columnId: 'department',
                        title: 'Department',
                        options: departments.map((dept: any) => ({
                            label: dept.nama_department,
                            value: dept.nama_department,
                        })),
                    },
                ]}
            />

            <DataTable table={table} loading={isLoading} />

            <DataTablePagination
                table={table}
                pageCount={data?.pageCount ?? 0}
            />

            <DivisiBulkActions table={table} />
        </div>
    )
}
