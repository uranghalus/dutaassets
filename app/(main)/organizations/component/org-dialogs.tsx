/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useDialog } from "@/context/dialog-provider"
import { OrgActionDialog } from "./org-action-dialog"
import { OrgDeleteDialog } from "./org-delete-dialog"

export default function OrgDialogs() {
    const { currentRow, open, setCurrentRow, setOpen } = useDialog()

    return (
        <>
            <OrgActionDialog key={'org-add'} open={open === 'add'} onOpenChange={() => setOpen('add')} />

            {currentRow && (
                <>
                    <OrgActionDialog key={`org-edit-${(currentRow as any).id as string}`} open={open === 'edit'} onOpenChange={() => { setOpen('edit'); setCurrentRow(undefined) }} currentRow={currentRow as any} />
                    <OrgDeleteDialog key={`org-delete-${(currentRow as any).id as string}`} open={open === 'delete'} onOpenChange={() => { setOpen('delete') }} currentRow={currentRow as any} />
                </>
            )}
        </>
    )
}
