"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useAssetDialog } from "./asset-dialog-provider";
import { Asset, Department, Divisi, Karyawan } from "@/generated/prisma/client";

type AssetWithRelations = Asset & {
  department_fk: Department;
  divisi_fk?: Divisi | null;
  karyawan_fk?: Karyawan | null;
};

const ActionCell = ({ row }: { row: AssetWithRelations }) => {
  const { setOpen, setCurrentAsset } = useAssetDialog();

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
            setCurrentAsset(row);
            setOpen("edit");
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            setCurrentAsset(row);
            setOpen("delete");
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const assetColumns: ColumnDef<AssetWithRelations>[] = [
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
    accessorKey: "kode_asset",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ cell }) => (
      <div className="font-mono">{cell.getValue() as string}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "nama_asset",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => (
      <span className="font-medium">{cell.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "kategori_asset",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    size: 150,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand/Model" />
    ),
    cell: ({ row }) => {
      const brand = row.original.brand;
      const model = row.original.model;
      if (!brand && !model) return "-";
      return (
        <div className="flex flex-col text-xs">
          {brand && <span>{brand}</span>}
          {model && <span className="text-muted-foreground">{model}</span>}
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue() as string;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "outline";

      if (status === "AVAILABLE") variant = "default"; // Green-ish usually default is black/primary
      if (status === "IN_USE") variant = "secondary";
      if (status === "MAINTENANCE") variant = "destructive"; // Or warning color if supported
      if (status === "DISPOSED") variant = "outline";

      return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
    },
    size: 100,
  },
  {
    id: "location_dept",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location / Dept" />
    ),
    cell: ({ row }) => {
      const dept = row.original.department_fk?.nama_department;
      const location = row.original.lokasi;

      return (
        <div className="flex flex-col text-xs">
          {location && <span className="font-medium">{location}</span>}
          {dept && <span className="text-muted-foreground">{dept}</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row.original} />,
    size: 50,
  },
];
