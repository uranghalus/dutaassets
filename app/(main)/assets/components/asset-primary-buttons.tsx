"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAssetDialog } from "./asset-dialog-provider";
import { ImportButton } from "@/components/import-export/import-button";
import { ExportButton } from "@/components/import-export/export-button";
import { importAssets, getAssetsForExport } from "@/action/asset-action";
import { useSearchParams } from "next/navigation";

export function AssetPrimaryButtons() {
  const { setOpen } = useAssetDialog();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const assetHeaders = [
    { label: "Asset Code", key: "kode_asset" },
    { label: "Asset Name", key: "nama_asset" },
    { label: "Category", key: "kategori_asset" },
    { label: "Department", key: "department_fk.nama" },
    { label: "Division", key: "divisi_fk.nama" },
    { label: "Employee", key: "karyawan_fk.nama" },
    { label: "Status", key: "status" },
    { label: "Condition", key: "kondisi" },
    { label: "Brand", key: "brand" },
    { label: "Model", key: "model" },
    { label: "Serial Number", key: "serial_number" },
    { label: "Location", key: "lokasi" },
    { label: "Purchase Date", key: "tgl_pembelian" },
    { label: "Price", key: "harga" },
  ];

  return (
    <div className="flex items-center gap-2">
      <ExportButton
        fileName="assets_export"
        headers={assetHeaders}
        onExportCurrentPage={() => getAssetsForExport({ search })}
        onExportAll={() => getAssetsForExport({ search })}
      />
      <ImportButton
        title="Import Assets"
        description="Upload a CSV file to batch create fixed assets."
        onImport={importAssets as any}
      />
      <Button onClick={() => setOpen("add")} className="space-x-1">
        <span>New Asset</span>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
