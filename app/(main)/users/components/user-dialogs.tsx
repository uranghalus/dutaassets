'use client'

import { useDialog } from '@/context/dialog-provider'
import { UserActionDialog } from './user-action-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteUser, useToggleBanUser } from '@/hooks/use-users'
import { Loader2, TriangleAlert } from 'lucide-react'

export default function UserDialogs() {
    const { open, setOpen, currentRow } = useDialog() // Changed from isOpen, closeDialog, payload
    const deleteMutation = useDeleteUser()
    const banMutation = useToggleBanUser()

    // Helper to close
    const closeDialog = () => setOpen(null)

    // 1. EDIT / CREATE
    if (open === 'edit') {
        return (
            <UserActionDialog
                open={true}
                onOpenChange={(v) => !v && closeDialog()}
                currentRow={currentRow}
            />
        )
    }

    if (open === 'add') {
        return (
            <UserActionDialog
                open={true}
                onOpenChange={(v) => !v && closeDialog()}
                currentRow={undefined}
            />
        )
    }

    // 2. DELETE
    if (open === 'delete') {
        const user = currentRow as any
        return (
            <ConfirmDialog
                open={true}
                onOpenChange={(v) => !v && closeDialog()}
                handleConfirm={async () => {
                   await deleteMutation.mutateAsync(user.id)
                   closeDialog()
                }}
                isLoading={deleteMutation.isPending}
                title="Delete User"
                desc={
                   <div className="space-y-2">
                     <p>Are you sure you want to delete <span className="font-bold">{user.name}</span>?</p>
                     <p className="text-red-500 text-sm">This action cannot be undone.</p>
                   </div>
                }
                confirmText="Delete"
                destructive
            />
        )
    }

    // 3. BAN / UNBAN
    if (open === 'ban') {
        const user = currentRow as any
        const isBanned = user.banned
        return (
            <ConfirmDialog
                open={true}
                onOpenChange={(v) => !v && closeDialog()}
                handleConfirm={async () => {
                    await banMutation.mutateAsync({
                        userId: user.id,
                        isBanned: !isBanned,
                        reason: !isBanned ? 'Banned by admin' : undefined
                    })
                    closeDialog()
                }}
                isLoading={banMutation.isPending}
                title={isBanned ? "Unban User" : "Ban User"}
                desc={
                     isBanned 
                     ? `Are you sure you want to unban ${user.name}? They will be able to log in again.`
                     : `Are you sure you want to ban ${user.name}? They will lose access immediately.`
                }
                confirmText={isBanned ? "Unban" : "Ban"}
                destructive={!isBanned}
            />
        )
    }

    return null
}
