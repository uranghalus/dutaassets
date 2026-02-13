import React from "react";
import { Main } from "@/components/main";
import { Metadata } from "next";
import { ApprovalDialogProvider } from "./components/approval-dialog-provider";
import { ApprovalTable } from "./components/approval-table";
import { ApprovalDialog } from "./components/approval-dialog";

export const metadata: Metadata = {
  title: "Requisition Approval",
  description: "Process and approve stock requisitions.",
};

export default function RequisitionApprovalPage() {
  return (
    <ApprovalDialogProvider>
      <Main fixed>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Requisition Approval
            </h2>
            <p className="text-muted-foreground">
              Manage and process pending stock requests from departments.
            </p>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <ApprovalTable />
        </div>
        <ApprovalDialog />
      </Main>
    </ApprovalDialogProvider>
  );
}
