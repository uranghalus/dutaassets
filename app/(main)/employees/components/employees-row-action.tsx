import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { useDialog } from '@/context/dialog-provider'
import { Karyawan } from '@/generated/prisma/client'
import { EmployeeWithDivisi } from '@/types/employee'
import { Row } from '@tanstack/react-table'
import { SquarePen, Trash2 } from 'lucide-react'
import React from 'react'
type DataTableRowActionsProps = {
    row: Row<EmployeeWithDivisi>
}
export default function EmployeesRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useDialog()
    return (
        <ButtonGroup>
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
