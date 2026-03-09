"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  SafetyInspection,
  SafetyEquipment,
  Asset,
  SafetyInspectionItem,
  User,
} from "@/generated/prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type SafetyInspectionWithRelations = SafetyInspection & {
  equipment: SafetyEquipment & {
    asset: Pick<Asset, "nama_asset" | "kode_asset">;
  };
  inspector: Pick<User, "id" | "name"> | null;
  items: SafetyInspectionItem[];
};

export const inspectionColumns: ColumnDef<SafetyInspectionWithRelations>[] = [
  {
    accessorKey: "inspectionDate",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground whitespace-nowrap">
        {format(new Date(row.original.inspectionDate), "dd MMM yyyy HH:mm")}
      </div>
    ),
  },
  {
    id: "asset_name",
    accessorFn: (row) => row.equipment?.asset?.nama_asset,
    header: "Equipment",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.equipment?.asset?.nama_asset || "-"}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {row.original.equipment?.asset?.kode_asset || ""}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "equipment.type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.equipment?.type === "APAR"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-blue-50 text-blue-700 border-blue-200"
        }
      >
        {row.original.equipment?.type || "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "shift",
    header: "Shift",
    cell: ({ row }) => <Badge variant="secondary">{row.original.shift}</Badge>,
  },
  {
    accessorKey: "inspector.name",
    header: "Inspector",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.inspector?.name || "-"}</div>
    ),
  },
  {
    accessorKey: "items",
    header: "Checklist",
    cell: ({ row }) => {
      const items = row.original.items || [];
      const ok = items.filter((i) => i.status === "OK").length;
      return (
        <div className="text-sm">
          <span className="text-green-600">{ok} OK</span>
          {" / "}
          <span className="text-muted-foreground">{items.length} items</span>
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div
        className="text-sm text-muted-foreground truncate max-w-[200px]"
        title={row.original.notes || "-"}
      >
        {row.original.notes || "-"}
      </div>
    ),
  },
];
