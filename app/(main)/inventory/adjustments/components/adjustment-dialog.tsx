"use client";

import { useDialog } from "@/context/dialog-provider";
import { AdjustmentActionDialog } from "./adjustment-action-dialog";

export default function AdjustmentDialogs() {
  const { open, setOpen } = useDialog();
  return (
    <>
      <AdjustmentActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
      />
    </>
  );
}
