'use client'

import { DataTableColumnHeader } from '@/components/datatable/datatable-column-header'
import { Checkbox } from '@/components/ui/checkbox'

import { cn } from '@/lib/utils'
import { Column, ColumnDef } from '@tanstack/react-table'
import EmployeesRowActions from './employees-row-action'
import { EmployeeWithDivisi } from '@/types/employee'


export const employeesColumns: ColumnDef<EmployeeWithDivisi>[] = [
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
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },

    /* =====================
     * NIK
     ===================== */
    {
        accessorKey: 'nik',
        header: ({ column }: { column: Column<EmployeeWithDivisi, unknown> }) => (
            <DataTableColumnHeader column={column} title="NIK" />
        ),
        cell: ({ cell }) => (
            <div className="font-medium ps-2">
                {cell.getValue<EmployeeWithDivisi['nik']>()}
            </div>
        ),
        size: 120,
    },

    /* =====================
     * NAMA
     ===================== */
    {
        accessorKey: 'nama',
        header: ({ column }: { column: Column<EmployeeWithDivisi, unknown> }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ cell }) => (
            <div className="font-medium ps-2">
                {cell.getValue<EmployeeWithDivisi['nama']>()}
            </div>
        ),
        meta: {
            thClassName: 'w-full',
            tdClassName: 'w-full',
        },
    },

    /* =====================
     * JABATAN
     ===================== */
    {
        accessorKey: 'jabatan',
        header: ({ column }: { column: Column<EmployeeWithDivisi, unknown> }) => (
            <DataTableColumnHeader column={column} title="Jabatan" />
        ),
        cell: ({ cell }) => (
            <div className="ps-2">
                {cell.getValue<EmployeeWithDivisi['jabatan']>()}
            </div>
        ),
        size: 150,
    },

    {
        id: 'divisi',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Divisi" />
        ),
        accessorFn: (row) => row.divisi_fk?.nama_divisi ?? '-',
        cell: ({ row }) => (
            <div className="ps-2">
                {row.original.divisi_fk?.nama_divisi ?? '-'}
            </div>
        ),
        size: 160,
    },

    /* =====================
    * STATUS
    ===================== */
    {
        accessorKey: 'status_karyawan',
        header: ({ column }: { column: Column<EmployeeWithDivisi, unknown> }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => (
            <div className="ps-2">
                {cell.getValue<EmployeeWithDivisi['status_karyawan']>()}
            </div>
        ),
        size: 120,
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
        size: 48,
        minSize: 48,
        maxSize: 48,
        enableResizing: false,
        cell: EmployeesRowActions,
        meta: {
            className: cn(
                'sticky right-0 z-10 w-[60px] px-2',
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200',
            ),
        },
    },
]
