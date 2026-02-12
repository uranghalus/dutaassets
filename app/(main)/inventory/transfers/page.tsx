import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import TransferDialogs from "./components/transfer-dialog";
import TransferPrimaryButtons from "./components/transfer-primary-buttons";
import { TransferTable } from "./components/transfer-table";

export const metadata: Metadata = {
  title: "Stock Transfers",
  description: "Move inventory between warehouses.",
};

export default function TransferPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Stock Transfers
            </h2>
            <p className="text-muted-foreground">
              Manage internal stock movements across locations.
            </p>
          </div>
          <TransferPrimaryButtons />
        </div>

        <TransferTable />
      </Main>
      <TransferDialogs />
    </DialogProvider>
  );
}
