"use client";

import { useAssetDialog } from "./asset-dialog-provider";
import { AssetActionDialog } from "./asset-action-dialog";
import { AssetDeleteDialog } from "./asset-delete-dialog";
import { AssetMultiDeleteDialog } from "./asset-multi-delete-dialog";
import { Table } from "@tanstack/react-table";

export function AssetDialog({ table }: { table: Table<any> }) {
  const { open, setOpen } = useAssetDialog();

  return (
    <>
      <AssetActionDialog />
      <AssetDeleteDialog />
      <AssetMultiDeleteDialog
        table={table}
        open={open === "multi-delete"}
        onOpenChange={(val) => setOpen(val ? "multi-delete" : null)}
      />
    </>
  );
}
