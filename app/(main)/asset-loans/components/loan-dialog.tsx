"use client";

import { LoanActionDialog } from "./loan-action-dialog";
import { LoanDeleteDialog } from "./loan-delete-dialog";
import { LoanReturnDialog } from "./loan-return-dialog";
import { LoanViewDialog } from "./loan-view-dialog";

export function LoanDialog() {
  return (
    <>
      <LoanActionDialog />
      <LoanReturnDialog />
      <LoanDeleteDialog />
      <LoanViewDialog />
    </>
  );
}
