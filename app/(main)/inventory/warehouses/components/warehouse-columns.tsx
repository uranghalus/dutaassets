"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { WarehouseRowActions } from "./warehouse-row-action";
import { Warehouse } from "@/generated/prisma/client";

export const warehouseColumns: ColumnDef<Warehouse>[] = [
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
     * NAME
     ===================== */
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Gudang" />
    ),
    cell: ({ cell }) => (
      <div className="font-medium ps-2 capitalize">
        {cell.getValue() as string}
      </div>
    ),
    size: 200,
  },

  /* =====================
     * LOCATION
     ===================== */
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lokasi" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2">{(cell.getValue() as string) || "-"}</div>
    ),
    size: 200,
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
    cell: WarehouseRowActions,
    meta: {
      className: cn(
        "sticky right-0 z-10 w-[60px] px-2",
        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200",
      ),
    },
  },
];
