/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/datatable/datatable-bulk-action'

import { Department } from '@/generated/prisma/client'
import { DepartmentsMultiDeleteDialog } from './dept-multi-delete-dialog'

type DepartmentsBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DepartmentsBulkActions<TData>({
    table,
}: DepartmentsBulkActionsProps<TData>) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedDepartments = selectedRows.map(
        (row) => row.original as Department
    )

    const handleOpenDelete = () => {
        if (selectedDepartments.length === 0) return
        setShowDeleteConfirm(true)
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName="department">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleOpenDelete}
                            className="size-8"
                            aria-label="Delete selected departments"
                            title="Delete selected departments"
                        >
                            <Trash2 />
                            <span className="sr-only">
                                Delete selected departments
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete selected departments</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <DepartmentsMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
