import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import AdjustmentDialogs from "./components/adjustment-dialog";
import AdjustmentPrimaryButtons from "./components/adjustment-primary-buttons";
import { AdjustmentTable } from "./components/adjustment-table";

export const metadata: Metadata = {
  title: "Stock Adjustments",
  description: "Manage inventory stock corrections.",
};

export default function AdjustmentPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Stock Adjustments
            </h2>
            <p className="text-muted-foreground">
              Record manual stock corrections and initial balances.
            </p>
          </div>
          <AdjustmentPrimaryButtons />
        </div>

        <AdjustmentTable />
      </Main>
      <AdjustmentDialogs />
    </DialogProvider>
  );
}
