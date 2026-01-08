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
import { DataTableBulkActions } from '@/components/datatable/datatable-bulk-action'
import { Karyawan } from '@/generated/prisma/client'
import { EmployeeMultiDeleteDialog } from './employees-multi-delete-dialog'

type EmployeeBulkActionsProps<TData> = {
    table: Table<TData>
}

export function EmployeeBulkActions<TData>({
    table,
}: EmployeeBulkActionsProps<TData>) {
    const [openDelete, setOpenDelete] = useState(false)

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedEmployees = selectedRows.map(
        (row) => row.original as Karyawan
    )

    const handleOpenDelete = () => {
        if (selectedEmployees.length === 0) return
        setOpenDelete(true)
    }

    return (
        <>
            <DataTableBulkActions table={table} entityName="employee">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="size-8"
                            onClick={handleOpenDelete}
                            aria-label="Delete selected employees"
                        >
                            <Trash2 />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Delete selected employees
                    </TooltipContent>
                </Tooltip>
            </DataTableBulkActions>

            <EmployeeMultiDeleteDialog
                table={table}
                open={openDelete}
                onOpenChange={setOpenDelete}
            />
        </>
    )
}
