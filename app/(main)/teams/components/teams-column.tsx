"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

import { Team } from "@/generated/prisma/client";
import { TeamRowActions } from "./teams-row-action";

// Define the shape of data returned by getTeams (includes relations)
export type TeamWithRelations = Team & {
  divisi: {
    nama_divisi: string;
    department: {
      nama_department: string;
    };
  } | null;
};

export const teamColumns: ColumnDef<TeamWithRelations>[] = [
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
    size: 10,
  },

  /* =====================
     * NAME
     ===================== */
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Team" />
    ),
    cell: ({ cell }) => (
      <div className="font-medium ps-2 capitalize">
        {cell.getValue() as string}
      </div>
    ),
    size: 140,
  },

  /* =====================
     * KODE
     ===================== */
  {
    accessorKey: "kode_team",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ cell }) => <div className="ps-2">{cell.getValue() as string}</div>,
    size: 100,
  },

  /* =====================
     * DIVISI / DEPT
     ===================== */
  {
    id: "divisi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Divisi / Dept" />
    ),
    accessorFn: (row) => row.divisi?.nama_divisi,
    cell: ({ row }) => {
      const divisi = row.original.divisi;
      if (!divisi) return <div className="ps-2 text-muted-foreground">-</div>;

      return (
        <div className="ps-2 flex flex-col">
          <span className="font-medium">{divisi.nama_divisi}</span>
          <span className="text-xs text-muted-foreground">
            {divisi.department.nama_department}
          </span>
        </div>
      );
    },
    size: 200,
  },

  /* =====================
     * KETERANGAN
     ===================== */
  {
    accessorKey: "keterangan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keterangan" />
    ),
    cell: ({ cell }) => (
      <div className="ps-2 text-sm text-muted-foreground">
        {cell.getValue() as string}
      </div>
    ),
    size: 200,
  },

  /* =====================
     * CREATED AT
     ===================== */
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Dibuat" />
    ),
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
    size: 140,
  },

  /* =====================
     * ACTIONS
     ===================== */
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" className="ml-auto" />
    ),
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: TeamRowActions,
    meta: {
      className: cn(
        "sticky right-0 z-10 w-[60px] px-2",
        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200",
      ),
    },
  },
];
