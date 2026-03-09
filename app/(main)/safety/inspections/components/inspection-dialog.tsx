"use client";

import { useDialog } from "@/context/dialog-provider";
import { InspectionActionDialog } from "./inspection-action-dialog";

export function InspectionDialogs() {
  const { open, setOpen } = useDialog();
  return (
    <>
      <InspectionActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
      />
    </>
  );
}
