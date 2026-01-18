'use client'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { useDialog } from '@/context/dialog-provider'
import { authClient } from '@/lib/auth-client'

import { EmployeeWithDivisi } from '@/types/employee'
import { Row } from '@tanstack/react-table'
import { SquarePen, Trash2, UserPlus } from 'lucide-react'
import React from 'react'
type DataTableRowActionsProps = {
    row: Row<EmployeeWithDivisi>
}
export default function EmployeesRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useDialog()
    const { data: activeOrg } = authClient.useActiveOrganization()

    const isAdmin =
        activeOrg?.members?.[0]?.role === 'owner' ||
        activeOrg?.members?.[0]?.role === 'admin'

    const isLinked = !!row.original.userId
    return (
        <ButtonGroup>
            {isAdmin && !isLinked && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('sync-user')
                    }}
                >
                    <UserPlus />
                </Button>
            )}
            <Button variant={'outline'} size={'sm'} onClick={() => {
                setCurrentRow(row.original)
                setOpen('edit')
            }}>
                <SquarePen />
            </Button>
            <Button variant={'destructive'} size={'sm'} onClick={() => {
                setCurrentRow(row.original)
                setOpen('delete')
            }}>
                <Trash2 />
            </Button>
        </ButtonGroup>
    )
}
