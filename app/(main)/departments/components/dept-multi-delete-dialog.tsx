'use client'

import { AlertTriangle } from 'lucide-react'
import { type Table } from '@tanstack/react-table'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'

import { Department } from '@/generated/prisma/client'
import { useDeleteDepartmentsBulk } from '@/hooks/use-departments'


type DepartmentsMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DepartmentsMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: DepartmentsMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const departments = selectedRows.map(
        (row) => row.original as Department
    )

    const { mutate, isPending } = useDeleteDepartmentsBulk()

    const handleDelete = async () => {
        mutate(
            departments.map((d) => d.id_department),
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
                    Delete Departments
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">
                            {departments.length}
                        </span>{' '}
                        department{departments.length > 1 ? 's' : ''}?
                    </p>

                    <Alert variant="destructive">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This action will permanently delete the selected
                            departments. This cannot be undone.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText="Delete"
            destructive
        />
    )
}
