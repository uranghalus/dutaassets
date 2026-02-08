import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import RequisitionPrimaryButtons from "./components/requisition-primary-buttons";
import { RequisitionTable } from "./components/requisition-table";
import RequisitionDialogs from "./components/requisition-dialog";

export const metadata: Metadata = {
  title: "Stock Requisitions",
  description: "Manage inventory stock requests.",
};

export default function RequisitionPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Stock Requisitions
            </h2>
            <p className="text-muted-foreground">
              Manage and approve employee stock requests.
            </p>
          </div>
          <RequisitionPrimaryButtons />
        </div>

        <RequisitionTable />
      </Main>
      <RequisitionDialogs />
    </DialogProvider>
  );
}
