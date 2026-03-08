"use client";

import { useDialog } from "@/context/dialog-provider";
import { IssuanceActionDialog } from "./issuance-action-dialog";

export default function IssuanceDialogs() {
  const { open, setOpen } = useDialog();
  return (
    <>
      <IssuanceActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
      />
    </>
  );
}
