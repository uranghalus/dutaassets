"use client";

import { useDialog } from "@/context/dialog-provider";
import { TransferActionDialog } from "./transfer-action-dialog";

export default function TransferDialogs() {
  const { open, setOpen } = useDialog();
  return (
    <>
      <TransferActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
      />
    </>
  );
}
