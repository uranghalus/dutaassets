'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteEmployee } from '@/hooks/use-employee'

type EmployeeDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: {
        id_karyawan: string
        nik: string
        nama: string
    }
}

export function EmployeeDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: EmployeeDeleteDialogProps) {
    const [value, setValue] = useState('')
    const deleteMutation = useDeleteEmployee()

    const handleDelete = async () => {
        if (value.trim() !== currentRow.nik) return

        await deleteMutation.mutateAsync(currentRow.id_karyawan)
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
                value.trim() !== currentRow.nik ||
                deleteMutation.isPending
            }
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{' '}
                    Delete Employee
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p className="mb-2">
                        Are you sure you want to delete employee{' '}
                        <span className="font-bold">{currentRow.nama}</span>?
                        <br />
                        This action will permanently remove the employee with NIK{' '}
                        <span className="font-bold">{currentRow.nik}</span> and all
                        related data. This action cannot be undone.
                    </p>

                    <Label className="my-2">
                        Employee NIK:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter employee NIK to confirm deletion."
                        />
                    </Label>

                    <Alert variant="destructive">
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            Please be careful, this operation cannot be rolled back.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText={
                deleteMutation.isPending ? 'Deleting...' : 'Delete'
            }
            destructive
        />
    )
}
