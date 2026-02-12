import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import ReceiptDialogs from "./components/receipt-dialog";
import ReceiptPrimaryButtons from "./components/receipt-primary-buttons";
import { ReceiptTable } from "./components/receipt-table";

export const metadata: Metadata = {
  title: "Stock Receipts",
  description: "Record inbound items from vendors.",
};

export default function ReceiptPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Stock Receipts
            </h2>
            <p className="text-muted-foreground">
              Record and manage inbound inventory from external vendors.
            </p>
          </div>
          <ReceiptPrimaryButtons />
        </div>

        <ReceiptTable />
      </Main>
      <ReceiptDialogs />
    </DialogProvider>
  );
}
