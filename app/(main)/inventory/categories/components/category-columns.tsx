"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

import { ItemCategory } from "@/generated/prisma/client";
import { CategoryRowActions } from "./category-row-action";

// Extended type to include count
type ItemCategoryWithCount = ItemCategory & {
  _count?: {
    items: number;
  };
};

export const categoryColumns: ColumnDef<ItemCategoryWithCount>[] = [
  /* =====================
     * SELECT
     ===================== */
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
    size: 40,
  },

  /* =====================
     * NAME
     ===================== */
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category Name" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 font-medium">{cell.getValue() as string}</div>
    ),
    size: 200,
  },

  /* =====================
     * DESCRIPTION
     ===================== */
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 text-muted-foreground truncate max-w-[300px]">
        {(cell.getValue() as string) || "-"}
      </div>
    ),
    size: 300,
  },

  /* =====================
     * ITEMS COUNT
     ===================== */
  {
    id: "items_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => (
      <div className="ps-2">{row.original._count?.items ?? 0}</div>
    ),
    size: 100,
  },

  /* =====================
     * CREATED AT
     ===================== */
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
    size: 140,
  },

  /* =====================
     * ACTIONS
     ===================== */
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Action"
        className="ml-auto"
      />
    ),
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: CategoryRowActions,
    meta: {
      className: cn(
        "sticky right-0 z-10 w-[60px] px-2",
        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200",
      ),
    },
  },
];
