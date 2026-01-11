'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/datatable/datatable-bulk-action'
import { Organization } from '@/generated/prisma/client'
import { OrganizationsMultiDeleteDialog } from './org-multi-delete-dialog'



type OrganizationsBulkActionsProps<TData> = {
    table: Table<TData>
}

export function OrganizationsBulkActions<TData>({
    table,
}: OrganizationsBulkActionsProps<TData>) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedOrganizations = selectedRows.map(
        (row) => row.original as Organization
    )

    const handleOpenDelete = () => {
        if (selectedOrganizations.length === 0) return
        setShowDeleteConfirm(true)
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName="organization">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleOpenDelete}
                            className="size-8"
                            aria-label="Delete selected organizations"
                            title="Delete selected organizations"
                        >
                            <Trash2 />
                            <span className="sr-only">Delete selected organizations</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete selected organizations</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <OrganizationsMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
