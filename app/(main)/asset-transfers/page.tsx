import React from "react";
import { Main } from "@/components/main";
import { Metadata } from "next";
import { TransferDialogProvider } from "./components/transfer-dialog-provider";
import { TransferPrimaryButtons } from "./components/transfer-primary-buttons";
import { TransferTable } from "./components/transfer-table";
import { TransferDialog } from "./components/transfer-dialog";

export const metadata: Metadata = {
  title: "Asset Transfers",
  description:
    "Track and manage asset movements between locations and employees.",
};

export default function AssetTransfersPage() {
  return (
    <TransferDialogProvider>
      <Main fluid>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Asset Transfers
            </h2>
            <p className="text-muted-foreground">
              Monitor and authorize the movement of physical assets.
            </p>
          </div>
          <TransferPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <TransferTable />
        </div>
        <TransferDialog />
      </Main>
    </TransferDialogProvider>
  );
}
