"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  CheckCircle2,
  PackageCheck,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useTransferDialog,
  TransferWithRelations,
} from "./transfer-dialog-provider";

export const transferColumns: ColumnDef<TransferWithRelations>[] = [
  {
    accessorKey: "asset.kode_asset",
    header: "Asset Code",
  },
  {
    accessorKey: "asset.nama_asset",
    header: "Asset Name",
  },
  {
    id: "from",
    header: "From",
    cell: ({ row }) => {
      const { fromLocation, fromEmployee } = row.original;
      if (fromLocation) return <span>{fromLocation.name} (Loc)</span>;
      if (fromEmployee) return <span>{fromEmployee.nama} (Emp)</span>;
      return "-";
    },
  },
  {
    id: "to",
    header: "To",
    cell: ({ row }) => {
      const { toLocation, toEmployee } = row.original;
      if (toLocation) return <span>{toLocation.name} (Loc)</span>;
      if (toEmployee) return <span>{toEmployee.nama} (Emp)</span>;
      return "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "outline" | "destructive" =
        "secondary";
      let className = "";

      switch (status) {
        case "PENDING":
          variant = "secondary";
          className = "bg-yellow-100 text-yellow-800";
          break;
        case "APPROVED":
          variant = "default";
          className = "bg-blue-100 text-blue-800";
          break;
        case "COMPLETED":
          variant = "default";
          className = "bg-green-100 text-green-800";
          break;
        case "CANCELLED":
          variant = "destructive";
          break;
      }

      return (
        <Badge variant={variant} className={className}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { setOpen, setCurrentTransfer } = useTransferDialog();
      const transfer = row.original;

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
                setCurrentTransfer(transfer);
                setOpen("view");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            {transfer.status === "PENDING" && (
              <DropdownMenuItem
                onClick={() => {
                  setCurrentTransfer(transfer);
                  setOpen("approve");
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                Approve Transfer
              </DropdownMenuItem>
            )}

            {transfer.status === "APPROVED" && (
              <DropdownMenuItem
                onClick={() => {
                  setCurrentTransfer(transfer);
                  setOpen("complete");
                }}
              >
                <PackageCheck className="mr-2 h-4 w-4 text-green-600" />
                Mark as Completed
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => {
                setCurrentTransfer(transfer);
                setOpen("delete");
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
