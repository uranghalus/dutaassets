"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  StockTransfer,
  Warehouse,
  StockTransferItem,
} from "@/generated/prisma/client";

export const transferColumns: ColumnDef<
  StockTransfer & {
    fromWarehouse: Warehouse;
    toWarehouse: Warehouse;
    items: StockTransferItem[];
  }
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
  {
    accessorKey: "fromWarehouse.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => (
      <div className="font-medium ps-2 text-destructive">
        {row.original.fromWarehouse.name}
      </div>
    ),
    size: 150,
  },
  {
    id: "arrow",
    header: "",
    cell: () => <div className="text-muted-foreground">→</div>,
    size: 30,
  },
  {
    accessorKey: "toWarehouse.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination" />
    ),
    cell: ({ row }) => (
      <div className="font-medium ps-2 text-primary">
        {row.original.toWarehouse.name}
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
  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ cell }) => (
      <div
        className="ps-2 text-sm max-w-[200px] truncate"
        title={(cell.getValue() as string) || ""}
      >
        {(cell.getValue() as string) || "-"}
      </div>
    ),
    size: 200,
  },
];
