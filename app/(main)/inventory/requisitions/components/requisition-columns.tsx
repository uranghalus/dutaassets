"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  Requisition,
  Karyawan,
  RequisitionItem,
  Item,
} from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import { useDialog } from "@/context/dialog-provider";

// Helper component for Actions cell to use hooks
const ActionCell = ({ row }: { row: any }) => {
  const { setOpen, setCurrentRow } = useDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("view");
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const requisitionColumns: ColumnDef<
  Requisition & {
    requester: Karyawan;
    items: (RequisitionItem & { item: Item })[];
  }
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
     * REQUESTER
     ===================== */
  {
    id: "requester",
    accessorKey: "requester.nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requester" />
    ),
    cell: ({ row }) => (
      <div className="font-medium ps-2">{row.original.requester.nama}</div>
    ),
    size: 150,
  },

  /* =====================
     * STATUS
     ===================== */
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue() as string;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "outline";

      if (status === "COMPLETED") variant = "default";
      if (status === "APPROVED") variant = "default"; // Legacy

      if (status === "PENDING_SUPERVISOR") variant = "secondary";
      if (status === "PENDING_FA") variant = "outline";
      if (status === "PENDING_GM") variant = "outline";
      if (status === "PENDING_WAREHOUSE") variant = "outline"; // Maybe a warning yellow? Badge doesn't support custom colors easily without className.

      if (status === "REJECTED") variant = "destructive";

      const formatStatus = (s: string) => {
        return s.replace(/_/g, " ");
      };

      return (
        <Badge
          variant={variant}
          className={
            status.includes("PENDING")
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
              : ""
          }
        >
          {formatStatus(status)}
        </Badge>
      ); // Custom styling for pending states if needed, or just stick to variants. Let's stick to variants but maybe "outline" isn't distinct enough.
      // Actually, let's just return the Badge with standard variants for now, simpler.
      // But user might want to distinguish.
      // Let's use "secondary" for all PENDINGs for now to be safe, or stick to simple logic.

      if (status.startsWith("PENDING")) variant = "secondary";
      if (status === "REJECTED") variant = "destructive";
      if (status === "COMPLETED") variant = "default";

      return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
    },
    size: 100,
  },

  /* =====================
     * ITEMS COUNT
     ===================== */
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items Requested" />
    ),
    cell: ({ row }) => (
      <div className="ps-2 text-sm">{row.original.items.length} items</div>
    ),
    size: 120,
  },

  /* =====================
     * REMARKS
     ===================== */
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

  /* =====================
     * ACTIONS
     ===================== */
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
    size: 50,
  },
];
