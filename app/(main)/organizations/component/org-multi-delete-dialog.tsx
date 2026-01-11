'use client'

import { AlertTriangle } from 'lucide-react'
import { type Table } from '@tanstack/react-table'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Organization } from '@/generated/prisma/client'
import { useDeleteOrganizationsBulk } from '@/hooks/use-organization'


type OrganizationsMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrganizationsMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: OrganizationsMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const organizations = selectedRows.map(
        (row) => row.original as Organization
    )
    const { mutate, isPending } = useDeleteOrganizationsBulk()
    const handleDelete = async () => {
        mutate(organizations.map((o) => o.id), {
            onSuccess: () => {
                table.resetRowSelection()
                onOpenChange(false)
            },
        })
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
                    Delete Organizations
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">
                            {organizations.length}
                        </span>{' '}
                        organization{organizations.length > 1 ? 's' : ''}?
                    </p>

                    <Alert variant="destructive">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This action will permanently delete the selected organizations.
                            This cannot be undone.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText="Delete"
            destructive
        />
    )
}
