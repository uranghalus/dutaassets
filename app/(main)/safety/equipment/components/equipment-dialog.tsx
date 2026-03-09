"use client";

import { useDialog } from "@/context/dialog-provider";
import { EquipmentActionDialog } from "./equipment-action-dialog";
import { EquipmentQrDialog } from "./equipment-qr-dialog";

export function EquipmentDialogs() {
  const { open, setOpen, currentRow } = useDialog<{
    qrCode: string;
    assetName: string;
  }>();
  return (
    <>
      <EquipmentActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
      />
      <EquipmentQrDialog
        open={open === "view-qr"}
        onOpenChange={() => setOpen(null)}
        qrValue={currentRow?.qrCode || ""}
        assetName={currentRow?.assetName || ""}
      />
    </>
  );
}
