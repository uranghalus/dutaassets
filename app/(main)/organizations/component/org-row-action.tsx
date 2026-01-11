'use client'
import { type Row } from '@tanstack/react-table'
import { Search, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Organization } from '@/generated/prisma/client'
import { useDialog } from '@/context/dialog-provider'
import Link from 'next/link'
import { ButtonGroup } from '@/components/ui/button-group'


type DataTableRowActionsProps = {
    row: Row<Organization>
}

export function OrgRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useDialog()
    return (
        <ButtonGroup>
            <Button variant={'outline'} size={'sm'} asChild>
                <Link href={`/organizations/${row.original.id}`} className='space-x-2'>
                    <Search size={16} />
                </Link>
            </Button>
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
