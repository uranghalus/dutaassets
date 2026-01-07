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
import { Divisi } from '@/generated/prisma/client'
import { DivisiMultiDeleteDialog } from './div-multi-delete-dialog'


type DivisiBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DivisiBulkActions<TData>({
    table,
}: DivisiBulkActionsProps<TData>) {
    const [openDelete, setOpenDelete] = useState(false)

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedDivisions = selectedRows.map(
        (row) => row.original as Divisi
    )

    const handleOpenDelete = () => {
        if (selectedDivisions.length === 0) return
        setOpenDelete(true)
    }

    return (
        <>
            <DataTableBulkActions table={table} entityName="division">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="size-8"
                            onClick={handleOpenDelete}
                            aria-label="Delete selected divisions"
                        >
                            <Trash2 />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Delete selected divisions
                    </TooltipContent>
                </Tooltip>
            </DataTableBulkActions>

            <DivisiMultiDeleteDialog
                table={table}
                open={openDelete}
                onOpenChange={setOpenDelete}
            />
        </>
    )
}
