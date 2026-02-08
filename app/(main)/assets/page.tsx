import React from "react";
import { Main } from "@/components/main";
import { AssetDialogProvider } from "./components/asset-dialog-provider";
import { Metadata } from "next";
import { AssetDialog } from "./components/asset-dialog";
import { AssetPrimaryButtons } from "./components/asset-primary-buttons";
import { AssetTable } from "./components/asset-table";

export const metadata: Metadata = {
  title: "Fixed Assets",
  description: "Manage detailed records of all fixed assets.",
};

export default function AssetsPage() {
  return (
    <AssetDialogProvider>
      <Main fixed>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Fixed Assets</h2>
            <p className="text-muted-foreground">
              Track and manage your organization's fixed assets here.
            </p>
          </div>
          <AssetPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <AssetTable />
        </div>
        <AssetDialog />
      </Main>
    </AssetDialogProvider>
  );
}
