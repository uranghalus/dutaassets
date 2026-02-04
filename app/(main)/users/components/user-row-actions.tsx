'use client'

import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash, Ban, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDialog } from '@/context/dialog-provider'

interface UserRowActionsProps<TData> {
    row: Row<TData>
}

export default function UserRowActions<TData>({
    row,
}: UserRowActionsProps<TData>) {
    const user = row.original as any
    const { setOpen, setCurrentRow } = useDialog()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(user)
                        setOpen('edit')
                    }}
                >
                    <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Edit
                </DropdownMenuItem>
                
                <DropdownMenuItem
                     onClick={() => {
                        setCurrentRow(user)
                        setOpen('ban')
                    }}
                >
                     {user.banned ? (
                        <>
                            <ShieldCheck className="mr-2 h-3.5 w-3.5 text-green-600" />
                            Unban
                        </>
                     ) : (
                         <>
                            <Ban className="mr-2 h-3.5 w-3.5 text-orange-600" />
                            Ban
                         </>
                     )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                     onClick={() => {
                        setCurrentRow(user)
                        setOpen('delete')
                    }}
                >
                    <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
