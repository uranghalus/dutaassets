"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  StockAdjustment,
  Warehouse,
  StockAdjustmentItem,
} from "@/generated/prisma/client";

export const adjustmentColumns: ColumnDef<
  StockAdjustment & { warehouse: Warehouse; items: StockAdjustmentItem[] }
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
    size: 40,
  },

  /* =====================
     * DATE
     ===================== */
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 font-mono text-sm">
        {new Date(cell.getValue() as Date).toLocaleDateString()}
      </div>
    ),
    size: 100,
  },

  /* =====================
     * WAREHOUSE
     ===================== */
  {
    accessorKey: "warehouse.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Warehouse" />
    ),
    cell: ({ row }) => (
      <div className="font-medium ps-2">{row.original.warehouse.name}</div>
    ),
    size: 150,
  },

  /* =====================
     * REASON
     ===================== */
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ cell }) => (
      <div
        className="ps-2 text-sm max-w-[200px] truncate"
        title={cell.getValue() as string}
      >
        {cell.getValue() as string}
      </div>
    ),
    size: 200,
  },

  /* =====================
     * ITEMS COUNT
     ===================== */
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items Adjusted" />
    ),
    cell: ({ row }) => (
      <div className="ps-2 text-sm">{row.original.items.length} items</div>
    ),
    size: 120,
  },

  /* =====================
     * CREATED BY / INFO
     ===================== */
  // TODO: Add createdBy if available in schema later
];
