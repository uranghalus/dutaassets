'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteDivision } from '@/hooks/use-divisions'

type DivisiDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: {
        id_divisi: string
        nama_divisi: string
    }
}

export function DivisiDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: DivisiDeleteDialogProps) {
    const [value, setValue] = useState('')
    const deleteMutation = useDeleteDivision()

    const handleDelete = async () => {
        if (value.trim() !== currentRow.nama_divisi) return

        await deleteMutation.mutateAsync(currentRow.id_divisi)
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
                value.trim() !== currentRow.nama_divisi ||
                deleteMutation.isPending
            }
            title={
                <span className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="size-4 stroke-destructive" />
                    Delete Divisi
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to delete divisi{' '}
                        <span className="font-semibold">
                            {currentRow.nama_divisi}
                        </span>
                        ?
                        <br />
                        This action will permanently remove this divisi and
                        all related data. This action cannot be undone.
                    </p>

                    <Label className="space-y-2">
                        <span>
                            Type <strong>{currentRow.nama_divisi}</strong> to confirm:
                        </span>
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter divisi ID to confirm deletion"
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
