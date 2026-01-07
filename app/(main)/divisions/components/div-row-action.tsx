'use client'
import { type Row } from '@tanstack/react-table'
import { SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useDialog } from '@/context/dialog-provider'
import { ButtonGroup } from '@/components/ui/button-group'
import { Divisi } from '@/generated/prisma/client'


type DataTableRowActionsProps = {
    row: Row<Divisi>
}

export function DivRowActions({ row }: DataTableRowActionsProps) {
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
