import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import IssuanceDialogs from "./components/issuance-dialog";
import IssuancePrimaryButtons from "./components/issuance-primary-buttons";
import { IssuanceTable } from "./components/issuance-table";

export const metadata: Metadata = {
  title: "Stock Issuances",
  description:
    "Record and manage outbound inventory to employees or departments.",
};

export default function IssuancePage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Stock Issuances
            </h2>
            <p className="text-muted-foreground">
              Record outbound stock movements. Goods out will reduce warehouse
              inventory.
            </p>
          </div>
          <IssuancePrimaryButtons />
        </div>

        <IssuanceTable />
      </Main>
      <IssuanceDialogs />
    </DialogProvider>
  );
}
