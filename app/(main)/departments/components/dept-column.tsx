import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Department } from "@/generated/prisma/client"
import { cn } from "@/lib/utils"
import { Column, ColumnDef } from "@tanstack/react-table"
import { DeptRowActions } from "./dept-row-action"


export const deptColumns: ColumnDef<Department>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        size: 10
    },
    {
        accessorKey: "kode_department",
        header: ({ column }: { column: Column<Department, unknown> }) => (
            <DataTableColumnHeader column={column} title="Kode Department" />
        ),
        cell: ({ cell }) => {
            return <div className="font-medium ps-2">{cell.getValue<Department['kode_department']>()}</div>
        },
        size: 90
    },
    {
        accessorKey: "nama_department",
        header: ({ column }: { column: Column<Department, unknown> }) => (
            <DataTableColumnHeader column={column} title="Nama Department" />
        ),
        cell: ({ cell }) => {
            return <div className="font-medium ps-2">{cell.getValue<Department['nama_department']>()}</div>
        },
        meta: {
            thClassName: 'w-full',
            tdClassName: 'w-full',
        },
        maxSize: 50
    },
    {
        accessorKey: 'id_hod',
        header: ({ column }: { column: Column<Department, unknown> }) => (
            <DataTableColumnHeader column={column} title="HOD" />
        ),
        cell: ({ cell }) => { return <div className="font-medium ps-2">{cell.getValue<Department['id_hod']>()}</div> }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Aksi" className="ml-auto" />,
        size: 48,
        minSize: 48,
        maxSize: 48,
        enableResizing: false,
        cell: DeptRowActions,
        meta: {
            className: cn(
                'sticky right-0 z-10 w-[60px] px-2',
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200',
            ),
        },
    }
] 