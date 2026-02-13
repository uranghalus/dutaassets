"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransferDialog } from "./transfer-dialog-provider";

export function TransferPrimaryButtons() {
  const { setOpen, setCurrentTransfer } = useTransferDialog();

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          setCurrentTransfer(null);
          setOpen("create");
        }}
        size="sm"
        className="h-8 gap-1"
      >
        <Plus className="h-4 w-4" />
        <span>New Transfer</span>
      </Button>
    </div>
  );
}
