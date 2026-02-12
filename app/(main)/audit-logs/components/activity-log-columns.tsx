"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ActivityLog, User } from "@/generated/prisma/client";

export const activityLogColumns: ColumnDef<
  ActivityLog & { user: User | null }
>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 font-mono text-xs">
        {new Date(cell.getValue() as Date).toLocaleString()}
      </div>
    ),
    size: 160,
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ cell }) => {
      const action = cell.getValue() as string;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";

      if (action.includes("CREATE") || action.includes("RECEIPT"))
        variant = "default";
      if (action.includes("UPDATE") || action.includes("TRANSFER"))
        variant = "secondary";
      if (action.includes("DELETE") || action.includes("ADJUSTMENT"))
        variant = "destructive";

      return (
        <Badge variant={variant} className="ps-2">
          {action.replace(/_/g, " ")}
        </Badge>
      );
    },
    size: 150,
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div className="ps-2 text-sm font-medium">
        {row.original.user?.name || "System"}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "entityType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 text-xs uppercase text-muted-foreground font-semibold">
        {cell.getValue() as string}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ cell }) => {
      const details = cell.getValue() as any;
      if (!details) return <div className="ps-2">-</div>;

      return (
        <div className="ps-2 text-xs max-w-[300px] truncate font-mono text-muted-foreground">
          {JSON.stringify(details)}
        </div>
      );
    },
    size: 300,
  },
  {
    accessorKey: "ipAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP Address" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 text-xs font-mono text-muted-foreground">
        {(cell.getValue() as string) || "-"}
      </div>
    ),
    size: 120,
  },
];
