"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { Plus } from "lucide-react";

export default function TransferPrimaryButtons() {
  const { setOpen } = useDialog();

  return (
    <Button onClick={() => setOpen("add")}>
      <Plus className="mr-2 h-4 w-4" /> New Transfer
    </Button>
  );
}
