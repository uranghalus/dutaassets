'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteOrganization } from '@/hooks/use-organization'


type OrgDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: {
        id: string
        name: string
        slug: string
    }
}

export function OrgDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OrgDeleteDialogProps) {
    const [value, setValue] = useState('')
    const deleteMutation = useDeleteOrganization()

    const handleDelete = async () => {
        if (value.trim() !== currentRow.slug) return

        await deleteMutation.mutateAsync(currentRow.id)
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
                value.trim() !== currentRow.slug ||
                deleteMutation.isPending
            }
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{' '}
                    Delete Organization
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p className="mb-2">
                        Are you sure you want to delete{' '}
                        <span className="font-bold">
                            {currentRow.name}
                        </span>
                        ?
                        <br />
                        This action will permanently remove the
                        organization with slug{' '}
                        <span className="font-bold">
                            {currentRow.slug}
                        </span>{' '}
                        and all its data. This cannot be undone.
                    </p>

                    <Label className="my-2">
                        Organization Slug:
                        <Input
                            value={value}
                            onChange={(e) =>
                                setValue(e.target.value)
                            }
                            placeholder="Enter organization slug to confirm deletion."
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
