"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ItemRowActions } from "./item-row-action";
import { Item, ItemCategory } from "@/generated/prisma/client";

export const itemColumns: ColumnDef<
  Item & { itemCategory?: ItemCategory | null }
>[] = [
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
    size: 10,
  },

  /* =====================
     * CODE
     ===================== */
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 font-mono text-sm">{cell.getValue() as string}</div>
    ),
    size: 100,
  },

  /* =====================
     * NAME
     ===================== */
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Barang" />
    ),
    cell: ({ cell }) => (
      <div className="font-medium ps-2 capitalize">
        {cell.getValue() as string}
      </div>
    ),
    size: 200,
  },

  /* =====================
     * CATEGORY
     ===================== */
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
    cell: ({ row }) => (
      <div className="ps-2">
        {row.original.itemCategory?.name ||
          (row.getValue("category") as string) ||
          "-"}
      </div>
    ),
    size: 140,
  },

  /* =====================
     * UNIT & STOCK
     ===================== */
  {
    id: "stock_info",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit / Min Stock" />
    ),
    cell: ({ row }) => (
      <div className="ps-2 flex flex-col">
        <span className="font-medium">{row.original.unit}</span>
        <span className="text-xs text-muted-foreground">
          Min: {row.original.minStock}
        </span>
      </div>
    ),
    size: 140,
  },

  /* =====================
     * CREATED AT
     ===================== */
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Dibuat" />
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
      <DataTableColumnHeader column={column} title="Aksi" className="ml-auto" />
    ),
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: ItemRowActions,
    meta: {
      className: cn(
        "sticky right-0 z-10 w-[60px] px-2",
        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200",
      ),
    },
  },
];
