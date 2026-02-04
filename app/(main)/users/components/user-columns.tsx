'use client'

import { DataTableColumnHeader } from '@/components/datatable/datatable-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { User } from 'better-auth/types' // Adjust based on actual type export
import { Link, Shield, ShieldAlert, ShieldCheck, User as UserIcon } from 'lucide-react'
import UserRowActions from './user-row-actions'


// Extend User type to include mapped employee
type UserWithEmployee = any & {
    employee?: {
        id_karyawan: string
        nama: string
        nik: string
    } | null
}

export const userColumns: ColumnDef<UserWithEmployee>[] = [
    /* =====================
     * SELECT
     ===================== */
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) =>
                    row.toggleSelected(!!value)
                }
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
    },

    /* =====================
     * USER INFO (Avatar + Name + Email)
     ===================== */
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image ?? ''} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                </div>
            )
        },
        meta: {
            thClassName: 'w-full', // Give space
        },
    },

    /* =====================
     * ROLE
     ===================== */
    {
        accessorKey: 'role',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ cell }) => (
            <div className="flex items-center gap-1">
               <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
               <span className="capitalize">{cell.getValue<string>()}</span>
            </div>
        ),
        size: 100,
    },

    /* =====================
     * LINKED EMPLOYEE
     ===================== */
    {
        id: 'employee',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Linked Employee" />
        ),
        cell: ({ row }) => {
            const employee = row.original.employee
            if (!employee) return <span className="text-muted-foreground text-xs">-</span>
            
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1 font-normal">
                        <Link className="h-3 w-3" />
                        {employee.nama} ({employee.nik})
                    </Badge>
                </div>
            )
        },
        size: 200,
    },

    /* =====================
     * STATUS (BANNED)
     ===================== */
    {
        accessorKey: 'banned', // Check actual field name from better-auth
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const isBanned = row.original.banned
            return isBanned ? (
                <Badge variant="destructive" className="gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    Banned
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100/80">
                    Active
                </Badge>
            )
        },
        size: 100,
    },

    /* =====================
     * ACTIONS
     ===================== */
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Aksi"
                className="ml-auto"
            />
        ),
        cell: UserRowActions,
        size: 56,
        enableResizing: false,
        meta: {
            className: cn(
                'sticky right-0 z-10',
                'bg-background group-hover/row:bg-muted',
                'group-data-[state=selected]/row:bg-muted transition-colors',
            ),
        },
    },
]
