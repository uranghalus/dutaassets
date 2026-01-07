/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useDialog } from '@/context/dialog-provider'
import { DivisionActionDialog } from './div-action-dialog'
import { DivisiDeleteDialog } from './div-delete-dialog'


export default function DivisiDialogs() {
    const { currentRow, open, setCurrentRow, setOpen } = useDialog()

    return (
        <>
            {/* ADD */}
            <DivisionActionDialog
                key="divisi-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    {/* EDIT */}
                    <DivisionActionDialog
                        key={`divisi-edit-${(currentRow as any).id_divisi}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />

                    {/* DELETE */}
                    <DivisiDeleteDialog
                        key={`divisi-delete-${(currentRow as any).id_divisi}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />
                </>
            )}
        </>
    )
}
