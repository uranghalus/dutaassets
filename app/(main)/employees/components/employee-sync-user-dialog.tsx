'use client'

import { UserPlus, RefreshCcw } from 'lucide-react'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Karyawan } from '@/generated/prisma/client'
import { useSyncEmployeeUser } from '@/hooks/use-employee'


type EmployeeSyncUserDialogProps = {
    currentRow: {
        id_karyawan: string
        nik: string
        nama: string
    }
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EmployeeSyncUserDialog({
    currentRow,
    open,
    onOpenChange,
}: EmployeeSyncUserDialogProps) {
    const { mutateAsync, isPending } = useSyncEmployeeUser()

    const handleSync = async () => {
        await mutateAsync(currentRow.id_karyawan)
        onOpenChange(false)
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleSync}
            isLoading={isPending}
            title={
                <span className="flex items-center gap-2">
                    <UserPlus className="size-4" />
                    Sync User
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to sync user account for employee:
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

                    <Alert>
                        <AlertTitle className="flex items-center gap-2">
                            <RefreshCcw className="size-4" />
                            What will happen?
                        </AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1">
                                <li>If user does not exist, a new user will be created</li>
                                <li>User will be added to the active organization</li>
                                <li>Employee and user will be linked</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText="Sync User"
        />
    )
}
