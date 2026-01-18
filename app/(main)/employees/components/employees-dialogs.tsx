/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useDialog } from '@/context/dialog-provider'
import { EmployeeActionDialog } from './employees-action-dialog'
import { EmployeeDeleteDialog } from './employees-delete-dialog'
import { EmployeeSyncUserDialog } from './employee-sync-user-dialog'

export default function EmployeeDialogs() {
    const { currentRow, open, setCurrentRow, setOpen } = useDialog()

    return (
        <>
            {/* ADD */}
            <EmployeeActionDialog
                key="employee-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    {/* EDIT */}
                    <EmployeeActionDialog
                        key={`employee-edit-${(currentRow as any).id_karyawan}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />

                    {/* DELETE */}
                    <EmployeeDeleteDialog
                        key={`employee-delete-${(currentRow as any).id_karyawan}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />
                    {/* Sync USER */}
                    <EmployeeSyncUserDialog
                        key={`employee-sync-user-${(currentRow as any).id_karyawan}`}
                        open={open === 'sync-user'}
                        onOpenChange={() => {
                            setOpen('sync-user')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />
                </>
            )}
        </>
    )
}
