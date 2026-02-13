"use client";

import { TransferActionDialog } from "./transfer-action-dialog";
import { TransferStatusDialog } from "./transfer-status-dialog";

export function TransferDialog() {
  return (
    <>
      <TransferActionDialog />
      <TransferStatusDialog />
      {/* View and Delete dialogs can be added here as needed for full CRUD */}
    </>
  );
}
