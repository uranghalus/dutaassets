import React from "react";
import { Main } from "@/components/main";
import { Metadata } from "next";
import { LoanDialogProvider } from "./components/loan-dialog-provider";
import { LoanPrimaryButtons } from "./components/loan-primary-buttons";
import { LoanTable } from "./components/loan-table";
import { LoanDialog } from "./components/loan-dialog";

export const metadata: Metadata = {
  title: "Peminjaman Aset",
  description: "Kelola peminjaman aset kepada karyawan.",
};

export default function AssetLoansPage() {
  return (
    <LoanDialogProvider>
      <Main fixed>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Peminjaman Aset
            </h2>
            <p className="text-muted-foreground">
              Catat dan kelola status peminjaman aset di sini.
            </p>
          </div>
          <LoanPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <LoanTable />
        </div>
        <LoanDialog />
      </Main>
    </LoanDialogProvider>
  );
}
