/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useDialog } from '@/context/dialog-provider'
import { DepartmentActionDialog } from './dept-action-dialog'
import { DepartmentDeleteDialog } from './dept-delete-dialog'


export default function DepartmentDialogs() {
    const { currentRow, open, setCurrentRow, setOpen } = useDialog()

    return (
        <>
            {/* ADD */}
            <DepartmentActionDialog
                key="department-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    {/* EDIT */}
                    <DepartmentActionDialog
                        key={`department-edit-${(currentRow as any).id_department as string}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />

                    {/* DELETE */}
                    <DepartmentDeleteDialog
                        key={`department-delete-${(currentRow as any).id_department as string}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                        }}
                        currentRow={currentRow as any}
                    />
                </>
            )}
        </>
    )
}
