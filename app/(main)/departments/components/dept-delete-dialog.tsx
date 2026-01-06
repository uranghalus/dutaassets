'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteDepartment } from '@/hooks/use-departments'



type DepartmentDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: {
        id_department: string
        kode_department: string
        nama_department: string
    }
}

export function DepartmentDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: DepartmentDeleteDialogProps) {
    const [value, setValue] = useState('')
    const deleteMutation = useDeleteDepartment()

    const handleDelete = async () => {
        if (value.trim() !== currentRow.kode_department) return

        await deleteMutation.mutateAsync(
            currentRow.id_department
        )
        setValue('')
        onOpenChange(false)
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(state) => {
                if (!state) setValue('')
                onOpenChange(state)
            }}
            handleConfirm={handleDelete}
            disabled={
                value.trim() !== currentRow.kode_department ||
                deleteMutation.isPending
            }
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{' '}
                    Delete Department
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p className="mb-2">
                        Are you sure you want to delete{' '}
                        <span className="font-bold">
                            {currentRow.nama_department}
                        </span>
                        ?
                        <br />
                        This action will permanently remove the
                        department with code{' '}
                        <span className="font-bold">
                            {currentRow.kode_department}
                        </span>{' '}
                        and all its related data. This action cannot
                        be undone.
                    </p>

                    <Label className="my-2">
                        Department Code:
                        <Input
                            value={value}
                            onChange={(e) =>
                                setValue(e.target.value)
                            }
                            placeholder="Enter department code to confirm deletion."
                        />
                    </Label>

                    <Alert variant="destructive">
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            Please be careful, this operation cannot
                            be rolled back.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText={
                deleteMutation.isPending
                    ? 'Deleting...'
                    : 'Delete'
            }
            destructive
        />
    )
}
