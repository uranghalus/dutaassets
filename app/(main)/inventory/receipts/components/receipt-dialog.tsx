"use client";

import { useDialog } from "@/context/dialog-provider";
import { ReceiptActionDialog } from "./receipt-action-dialog";

export default function ReceiptDialogs() {
  const { open, setOpen } = useDialog();
  return (
    <>
      <ReceiptActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
      />
    </>
  );
}
