import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import type { Organization } from "@/generated/prisma/client";
import { Column, ColumnDef } from "@tanstack/react-table";
import { OrgRowActions } from "./org-row-action";
import { cn } from "@/lib/utils";

export const orgColumns: ColumnDef<Organization>[] = [
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
        accessorKey: "name",
        header: ({ column }: { column: Column<Organization, unknown> }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ cell }) => {
            return <div className="font-medium ps-2">{cell.getValue<Organization['name']>()}</div>
        },
        size: 90
    },
    {
        accessorKey: "slug",
        header: ({ column }: { column: Column<Organization, unknown> }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ cell }) => {
            return <div className="font-medium ps-2">{cell.getValue<Organization['slug']>()}</div>
        },
        meta: {
            thClassName: 'w-full',
            tdClassName: 'w-full',
        },
        maxSize: 50
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }: { column: Column<Organization, unknown> }) => (
            <DataTableColumnHeader column={column} title="Tanggal Dibuat" />
        ),
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Aksi" className="ml-auto" />,
        size: 48,
        minSize: 48,
        maxSize: 48,
        enableResizing: false,
        cell: OrgRowActions,
        meta: {
            className: cn(
                'sticky right-0 z-10 w-[60px] px-2',
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200',
            ),
        },
    }
] 