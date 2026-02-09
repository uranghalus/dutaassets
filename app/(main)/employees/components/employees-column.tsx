"use client";

import Link from "next/link";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import { Column, ColumnDef } from "@tanstack/react-table";
import EmployeesRowActions from "./employees-row-action";
import { EmployeeWithDivisi } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX } from "lucide-react";

function EmployeeStatusBadge({ status }: { status?: string | null }) {
  if (!status) {
    return <Badge variant="secondary">-</Badge>;
  }

  const map: Record<string, "default" | "secondary" | "destructive"> = {
    Aktif: "default",
    Nonaktif: "secondary",
    Resign: "destructive",
    Cuti: "secondary",
  };

  return <Badge variant={map[status] ?? "secondary"}>{status}</Badge>;
}
export const employeesColumns: ColumnDef<EmployeeWithDivisi>[] = [
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
    size: 32,
  },

  /* =====================
     * NIK
     ===================== */
  {
    accessorKey: "nik",
    header: ({ column }: { column: Column<EmployeeWithDivisi> }) => (
      <DataTableColumnHeader column={column} title="NIK" />
    ),
    cell: ({ cell }) => (
      <div className="font-medium ps-2">{cell.getValue<string>()}</div>
    ),
    size: 120,
  },

  /* =====================
     * NAMA
     ===================== */
  {
    accessorKey: "nama",
    header: ({ column }: { column: Column<EmployeeWithDivisi> }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/employees/${row.original.id_karyawan}`}
        className="font-medium ps-2 hover:underline text-primary"
      >
        {row.original.nama}
      </Link>
    ),
    meta: {
      thClassName: "w-full",
      tdClassName: "w-full",
    },
  },

  /* =====================
     * JABATAN
     ===================== */
  {
    accessorKey: "jabatan",
    header: ({ column }: { column: Column<EmployeeWithDivisi> }) => (
      <DataTableColumnHeader column={column} title="Jabatan" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 text-muted-foreground">
        {cell.getValue<string>() || "-"}
      </div>
    ),
    size: 150,
  },

  /* =====================
     * DIVISI
     ===================== */
  {
    id: "divisi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Divisi" />
    ),
    accessorFn: (row) => row.divisi_fk?.nama_divisi ?? "-",
    cell: ({ row }) => (
      <div className="ps-2">{row.original.divisi_fk?.nama_divisi ?? "-"}</div>
    ),
    size: 160,
  },

  /* =====================
     * STATUS
     ===================== */
  {
    accessorKey: "status_karyawan",
    header: ({ column }: { column: Column<EmployeeWithDivisi> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <EmployeeStatusBadge status={row.original.status_karyawan} />
    ),
    size: 120,
  },

  /* =====================
     * USER LINKED
     ===================== */
  {
    id: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) =>
      row.original.userId ? (
        <div className="flex items-center gap-1 text-green-600">
          <UserCheck className="h-4 w-4" />
          <span className="text-xs">Linked</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-muted-foreground">
          <UserX className="h-4 w-4" />
          <span className="text-xs">—</span>
        </div>
      ),
    size: 90,
  },

  /* =====================
     * ACTIONS
     ===================== */
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" className="ml-auto" />
    ),
    cell: EmployeesRowActions,
    size: 56,
    enableResizing: false,
    meta: {
      className: cn(
        "sticky right-0 z-10",
        "bg-background group-hover/row:bg-muted",
        "group-data-[state=selected]/row:bg-muted transition-colors",
      ),
    },
  },
];
