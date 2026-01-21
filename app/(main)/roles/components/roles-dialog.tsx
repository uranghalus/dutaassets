/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useDialog } from '@/context/dialog-provider'
import { OrgRoleActionDialog } from './roles-action-dialog'



export default function OrgRoleDialogs() {
    const { currentRow, open, setCurrentRow, setOpen } = useDialog()

    return (
        <>
            {/* ADD */}
            <OrgRoleActionDialog
                key="org-role-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    {/* EDIT */}
                    <OrgRoleActionDialog
                        key={`org-role-edit-${(currentRow as any).id}`}
                        open={open === 'edit'}
                        currentRow={currentRow as any}
                        onOpenChange={() => {
                            setOpen('edit')
                            setCurrentRow(undefined)
                        }}
                    />

                    {/* DELETE */}
                    {/* <OrgRoleDeleteDialog
                        key={`org-role-delete-${(currentRow as any).id}`}
                        open={open === 'delete'}
                        currentRow={currentRow as any}
                        onOpenChange={() => {
                            setOpen('delete')
                            setCurrentRow(undefined)
                        }}
                    /> */}
                </>
            )}
        </>
    )
}
