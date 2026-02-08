"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Asset, AssetLoan, Karyawan } from "@/generated/prisma/client";
import { MoreHorizontal, Eye, Undo2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLoanDialog } from "./loan-dialog-provider";

type LoanWithRelations = AssetLoan & {
  asset: Asset;
  employee: Karyawan;
};

export const loanColumns: ColumnDef<LoanWithRelations>[] = [
  {
    accessorKey: "asset.kode_asset",
    header: "Asset Code",
  },
  {
    accessorKey: "asset.nama_asset",
    header: "Asset Name",
  },
  {
    accessorKey: "employee.nama",
    header: "Employee",
  },
  {
    accessorKey: "loanDate",
    header: "Loan Date",
    cell: ({ row }) => {
      return format(new Date(row.original.loanDate), "dd MMM yyyy");
    },
  },
  {
    accessorKey: "returnDate",
    header: "Expected Return",
    cell: ({ row }) => {
      const date = row.original.returnDate;
      return date ? format(new Date(date), "dd MMM yyyy") : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === "ACTIVE" ? "default" : "secondary"}
          className={
            status === "ACTIVE"
              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
              : "bg-green-100 text-green-800 hover:bg-green-100"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { setOpen, setCurrentLoan } = useLoanDialog();
      const loan = row.original;

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
                setCurrentLoan(loan);
                setOpen("view");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {loan.status === "ACTIVE" && (
              <DropdownMenuItem
                onClick={() => {
                  setCurrentLoan(loan);
                  setOpen("return");
                }}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Return Asset
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setCurrentLoan(loan);
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
