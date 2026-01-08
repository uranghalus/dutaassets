'use client'

import { AlertTriangle } from 'lucide-react'
import { type Table } from '@tanstack/react-table'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Karyawan } from '@/generated/prisma/client'
import { useDeleteEmployeeBulk } from '@/hooks/use-employee'

type EmployeeMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EmployeeMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: EmployeeMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const employees = selectedRows.map(
        (row) => row.original as Karyawan
    )

    const { mutate, isPending } = useDeleteEmployeeBulk()

    const handleDelete = async () => {
        mutate(
            employees.map((e) => e.id_karyawan),
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
                    Delete Employees
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">
                            {employees.length}
                        </span>{' '}
                        employee{employees.length > 1 ? 's' : ''}?
                    </p>

                    <Alert variant="destructive">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This action will permanently delete the selected employees
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
