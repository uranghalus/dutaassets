/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { DataTable } from '@/components/datatable/data-table'
import { DataTablePagination } from '@/components/datatable/datatable-pagination'
import { DataTableToolbar } from '@/components/datatable/datatable-toolbar'

import { useDataTable } from '@/hooks/use-data-table'
import { deptColumns } from './dept-column'
import { useDepartments } from '@/hooks/use-departments'
import { DepartmentsBulkActions } from './dept-bulk-action'




export function DepartmentTable() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, isLoading } = useDepartments({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
    })

    const { table } = useDataTable({
        data: data?.data ?? [],
        columns: deptColumns as any,
        columnResizeMode: 'onEnd',

        pageCount: data?.pageCount ?? 0,
        pagination,
        onPaginationChange: setPagination,
    })

    return (
        <div className="p-3 rounded-md border space-y-4">
            <DataTableToolbar
                table={table}
                searchKey="nama_department"
                searchPlaceholder="Search department..."
                filters={[
                    {
                        columnId: 'kode_department',
                        title: 'Kode Department',
                        options: [
                            { label: 'Contains DPT', value: 'DPT' },
                            { label: 'Contains DEP', value: 'DEP' },
                        ],
                    },
                    {
                        columnId: 'id_hod',
                        title: 'Head of Department',
                        options: [
                            { label: 'Has HOD', value: 'notnull' },
                            { label: 'No HOD', value: 'null' },
                        ],
                    },
                ]}
            />

            <DataTable table={table} loading={isLoading} />

            <DataTablePagination
                table={table}
                pageCount={data?.pageCount ?? 0}
            />

            <DepartmentsBulkActions table={table} />
        </div>
    )
}
