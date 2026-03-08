"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  StockIssuance,
  Warehouse,
  StockIssuanceItem,
  Item,
} from "@/generated/prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type StockIssuanceWithRelations = StockIssuance & {
  warehouse: Warehouse;
  items: (StockIssuanceItem & { item: Item })[];
};

export const issuanceColumns: ColumnDef<StockIssuanceWithRelations>[] = [
  {
    accessorKey: "issuedAt",
    header: "Date Issued",
    cell: ({ row }) => (
      <div className="text-muted-foreground whitespace-nowrap">
        {format(new Date(row.original.issuedAt), "dd MMM yyyy HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "referenceNumber",
    header: "Ref No.",
    cell: ({ row }) => (
      <div
        className="font-mono text-sm max-w-[150px] truncate"
        title={row.original.referenceNumber || "-"}
      >
        {row.original.referenceNumber || "-"}
      </div>
    ),
  },
  {
    accessorKey: "warehouse.name",
    header: "Source Warehouse",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.warehouse?.name || "-"}</div>
    ),
  },
  {
    accessorKey: "issuedTo",
    header: "Issued To",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-orange-50 text-orange-700 border-orange-200"
      >
        {row.original.issuedTo || "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const itemCount = row.original.items?.length || 0;
      return (
        <div className="text-sm">
          {itemCount} type{itemCount > 1 ? "s" : ""}
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
            {row.original.items
              ?.map((i) => `${i.item.name} (x${i.quantity})`)
              .join(", ")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => (
      <div
        className="text-sm text-muted-foreground truncate max-w-[200px]"
        title={row.original.remarks || "-"}
      >
        {row.original.remarks || "-"}
      </div>
    ),
  },
];
