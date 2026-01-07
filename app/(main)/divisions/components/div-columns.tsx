import { DataTableColumnHeader } from '@/components/datatable/datatable-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { Divisi } from '@/generated/prisma/client'
import { Column, ColumnDef } from '@tanstack/react-table'

type DivisiWithDepartment = Divisi & {
    department_fk: {
        nama_department: string
        kode_department: string
    }
}

export const divColumns: ColumnDef<DivisiWithDepartment>[] = [
    /* =======================
       SELECT
    ======================= */
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
        size: 40,
    },

    /* =======================
       NAMA DIVISI
    ======================= */
    {
        accessorKey: 'nama_divisi',
        header: ({ column }: { column: Column<DivisiWithDepartment, unknown> }) => (
            <DataTableColumnHeader column={column} title="Divisi" />
        ),
        cell: ({ cell }) => (
            <div className="font-medium ps-2">
                {cell.getValue<string>()}
            </div>
        ),
        size: 150,
    },

    /* =======================
       DEPARTMENT
    ======================= */
    {
        id: 'department',
        header: ({ column }: { column: Column<DivisiWithDepartment, unknown> }) => (
            <DataTableColumnHeader column={column} title="Department" />
        ),
        accessorFn: (row) => row.department_fk?.nama_department,
        cell: ({ row }) => {
            const dept = row.original.department_fk

            if (!dept) return <span>-</span>

            return (
                <div className="flex flex-col ps-2">
                    <span className="font-medium">
                        {dept.nama_department}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {dept.kode_department}
                    </span>
                </div>
            )
        },
        size: 180,
    },

    /* =======================
       EXT TLP
    ======================= */
    {
        accessorKey: 'ext_tlp',
        header: ({ column }: { column: Column<DivisiWithDepartment, unknown> }) => (
            <DataTableColumnHeader column={column} title="Ext" />
        ),
        cell: ({ cell }) => (
            <div className="ps-2">{cell.getValue<string>()}</div>
        ),
        size: 80,
    },
]
