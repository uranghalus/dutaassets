"use client";

import { AssetActionDialog } from "./asset-action-dialog";
import { AssetDeleteDialog } from "./asset-delete-dialog";
// import { AssetViewDialog } from "./asset-view-dialog"; // If we have one

export function AssetDialog() {
  return (
    <>
      <AssetActionDialog />
      <AssetDeleteDialog />
    </>
  );
}
