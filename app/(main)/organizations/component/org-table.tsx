/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { DataTable } from '@/components/datatable/data-table'
import { useState } from 'react'
import { orgColumns } from './org-columns'
import { useDataTable } from '@/hooks/use-data-table'
import { useOrganizations } from '@/hooks/use-organization'
import { DataTablePagination } from '@/components/datatable/datatable-pagination'
import { DataTableToolbar } from '@/components/datatable/datatable-toolbar'
import { OrganizationsBulkActions } from './org-bulk-action'


export function OrganizationTable() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, isLoading } = useOrganizations({ page: pagination.pageIndex, pageSize: pagination.pageSize })

    const { table } = useDataTable({
        data: data?.data ?? [],
        columns: orgColumns as any,
        columnResizeMode: 'onEnd',

        pageCount: data?.pageCount ?? 0,
        pagination,
        onPaginationChange: setPagination,
    })


    return (
        <div className='p-3 rounded-md border space-y-4'>
            <DataTableToolbar
                table={table}
                searchKey="name"
                searchPlaceholder="Search organization..."
                filters={[
                    {
                        columnId: 'slug',
                        title: 'Slug',
                        options: [
                            { label: 'Contains dash (-)', value: '-' },
                            { label: 'No dash', value: 'nodash' },
                        ],
                    },
                ]}
            />
            <DataTable table={table} loading={isLoading} />
            <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
            <OrganizationsBulkActions table={table} />
        </div>
    )
}
