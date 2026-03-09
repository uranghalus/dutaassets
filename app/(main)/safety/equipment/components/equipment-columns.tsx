"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  SafetyEquipment,
  Asset,
  SafetyInspection,
} from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useDialog } from "@/context/dialog-provider";

// We need a helper component for the QR cell so we can use hooks
const QrCodeCell = ({
  qrCode,
  assetName,
}: {
  qrCode: string | null;
  assetName: string;
}) => {
  const { setOpen, setCurrentRow } = useDialog<{
    qrCode: string;
    assetName: string;
  }>();

  if (!qrCode) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="flex items-center gap-2">
      <div
        className="font-mono text-sm text-muted-foreground truncate max-w-[120px]"
        title={qrCode}
      >
        {qrCode}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          setCurrentRow({ qrCode, assetName });
          setOpen("view-qr");
        }}
        title="View QR Code"
      >
        <QrCode className="h-4 w-4" />
      </Button>
    </div>
  );
};

type SafetyEquipmentWithRelations = SafetyEquipment & {
  asset: Asset;
  inspections: { id: string }[];
};

export const equipmentColumns: ColumnDef<SafetyEquipmentWithRelations>[] = [
  {
    id: "asset_name",
    accessorFn: (row) => row.asset?.nama_asset,
    header: "Asset Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.asset?.nama_asset || "-"}</div>
    ),
  },
  {
    accessorKey: "asset.kode_asset",
    header: "Asset Code",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">
        {row.original.asset?.kode_asset || "-"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.type === "APAR"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-blue-50 text-blue-700 border-blue-200"
        }
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "aparType",
    header: "Detail",
    cell: ({ row }) => {
      const eq = row.original;
      if (eq.type === "APAR") {
        return (
          <div className="text-sm">
            <div>{eq.aparType || "-"}</div>
            <div className="text-xs text-muted-foreground">
              {eq.sizeKg ? `${eq.sizeKg} kg` : "-"}
            </div>
          </div>
        );
      }
      return (
        <div className="text-sm">
          <div>{eq.hydrantType || "-"}</div>
          <div className="text-xs text-muted-foreground">
            {eq.hydrantSize || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "qrCode",
    header: "QR Code",
    cell: ({ row }) => (
      <QrCodeCell
        qrCode={row.original.qrCode}
        assetName={row.original.asset?.nama_asset || "Unknown Asset"}
      />
    ),
  },
  {
    accessorKey: "inspections",
    header: "Inspections",
    cell: ({ row }) => {
      const count = row.original.inspections?.length || 0;
      return (
        <Badge variant="secondary">
          {count} record{count !== 1 ? "s" : ""}
        </Badge>
      );
    },
  },
];
