"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  StockReceipt,
  Warehouse,
  StockReceiptItem,
} from "@/generated/prisma/client";

export const receiptColumns: ColumnDef<
  StockReceipt & { warehouse: Warehouse; items: StockReceiptItem[] }
>[] = [
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
  {
    accessorKey: "receivedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Received" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 font-mono text-sm">
        {new Date(cell.getValue() as Date).toLocaleDateString()}
      </div>
    ),
    size: 100,
  },
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
  {
    accessorKey: "vendorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 text-sm">{(cell.getValue() as string) || "-"}</div>
    ),
    size: 150,
  },
  {
    accessorKey: "referenceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ref/PO No." />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 text-sm font-mono">
        {(cell.getValue() as string) || "-"}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => (
      <div className="ps-2 text-sm">{row.original.items.length} items</div>
    ),
    size: 100,
  },
];
