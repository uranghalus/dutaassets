"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { AuditLog, User } from "@/generated/prisma/client";

export const activityLogColumns: ColumnDef<AuditLog & { user: User | null }>[] =
  [
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
        const action = String(cell.getValue() || "").toUpperCase();
        let variant: "default" | "secondary" | "destructive" | "outline" =
          "default";

        if (action.includes("CREATE")) variant = "default";
        if (action.includes("UPDATE")) variant = "secondary";
        if (action.includes("DELETE")) variant = "destructive";

        return (
          <Badge variant={variant} className="ps-2">
            {action.replace(/_/g, " ")}
          </Badge>
        );
      },
      size: 130,
    },
    {
      accessorKey: "model",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Module" />
      ),
      cell: ({ cell }) => (
        <div className="ps-2 text-xs uppercase text-muted-foreground font-semibold">
          {cell.getValue() as string}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "recordId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Record ID" />
      ),
      cell: ({ cell }) => (
        <div className="ps-2 text-xs font-mono truncate max-w-[150px]">
          {cell.getValue() as string}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "changes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Changes" />
      ),
      cell: ({ cell }) => {
        const changes = cell.getValue() as any;
        if (
          !changes ||
          (typeof changes === "object" && Object.keys(changes).length === 0)
        ) {
          return <div className="ps-2 text-muted-foreground">-</div>;
        }

        return (
          <div className="ps-2 text-xs max-w-[400px] truncate font-mono text-muted-foreground">
            {JSON.stringify(changes)}
          </div>
        );
      },
      size: 400,
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
  ];
