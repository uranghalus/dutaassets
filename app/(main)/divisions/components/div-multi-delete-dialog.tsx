'use client'

import { AlertTriangle } from 'lucide-react'
import { type Table } from '@tanstack/react-table'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Divisi } from '@/generated/prisma/client'
import { useDeleteDivisionBulk } from '@/hooks/use-divisions'

type DivisiMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DivisiMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: DivisiMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const divisions = selectedRows.map(
        (row) => row.original as Divisi
    )

    const { mutate, isPending } = useDeleteDivisionBulk()

    const handleDelete = async () => {
        mutate(
            divisions.map((d) => d.id_divisi),
            {
                onSuccess: () => {
                    table.resetRowSelection()
                    onOpenChange(false)
                },
            }
        )
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            isLoading={isPending}
            title={
                <span className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    Delete Divisions
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">
                            {divisions.length}
                        </span>{' '}
                        division{divisions.length > 1 ? 's' : ''}?
                    </p>

                    <Alert variant="destructive">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This action will permanently delete the selected divisions
                            and all related data. This cannot be undone.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText="Delete"
            destructive
        />
    )
}
