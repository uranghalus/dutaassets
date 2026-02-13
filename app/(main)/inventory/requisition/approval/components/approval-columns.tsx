"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MoreHorizontal, CheckCircle2, XCircle, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useApprovalDialog,
  RequisitionWithRelations,
} from "./approval-dialog-provider";

export const approvalColumns: ColumnDef<RequisitionWithRelations>[] = [
  {
    accessorKey: "id",
    header: "Request Number",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: "requester.nama",
    header: "Requester",
  },
  {
    accessorKey: "warehouse.name",
    header: "Warehouse",
    cell: ({ row }) => row.original.warehouse?.name || "-",
  },
  {
    id: "totalItems",
    header: "Total Items",
    cell: ({ row }) => row.original._count.items,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "outline" | "destructive" =
        "secondary";
      let className = "";

      if (status === "REJECTED") variant = "destructive";
      if (status === "COMPLETED") {
        variant = "default";
        className = "bg-green-100 text-green-800";
      }
      if (status.startsWith("PENDING")) {
        variant = "outline";
        className = "bg-yellow-100 text-yellow-800 border-yellow-200";
      }

      return (
        <Badge variant={variant} className={className}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { setOpen, setCurrentRequisition } = useApprovalDialog();
      const requisition = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setCurrentRequisition(requisition);
                setOpen("view");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setCurrentRequisition(requisition);
                setOpen("approve");
              }}
              className="text-green-600 focus:text-green-600 focus:bg-green-50"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setCurrentRequisition(requisition);
                setOpen("reject");
              }}
              className="text-destructive focus:text-destructive focus:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
