'use client'

import { UserX, AlertTriangle } from 'lucide-react'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUnlinkEmployeeUser } from '@/hooks/use-employee'

type EmployeeUnlinkUserDialogProps = {
    currentRow: {
        id_karyawan: string
        nik: string
        nama: string
    }
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EmployeeUnsyncUserDialog({
    currentRow,
    open,
    onOpenChange,
}: EmployeeUnlinkUserDialogProps) {
    const { mutateAsync, isPending } = useUnlinkEmployeeUser()

    const handleUnlink = async () => {
        await mutateAsync(currentRow.id_karyawan)
        onOpenChange(false)
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleUnlink}
            isLoading={isPending}
            title={
                <span className="flex items-center gap-2 text-destructive">
                    <UserX className="size-4" />
                    Unlink User
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to unlink the user account from this employee?
                    </p>

                    <div className="rounded-md border p-3 text-sm">
                        <p>
                            <span className="text-muted-foreground">Name:</span>{' '}
                            <span className="font-medium">{currentRow.nama}</span>
                        </p>
                        <p>
                            <span className="text-muted-foreground">NIK:</span>{' '}
                            <span className="font-medium">{currentRow.nik}</span>
                        </p>
                    </div>

                    <Alert variant="destructive">
                        <AlertTitle className="flex items-center gap-2">
                            <AlertTriangle className="size-4" />
                            Important
                        </AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Employee will no longer be linked to the user account</li>
                                <li>User account will NOT be deleted</li>
                                <li>You can re-sync the user at any time</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText="Unlink User"
            destructive
        />
    )
}
