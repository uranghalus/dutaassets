"use client";

import { useDialog } from "@/context/dialog-provider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function RequisitionPrimaryButtons() {
  const { setOpen } = useDialog();

  return (
    <Button onClick={() => setOpen("add")} size="sm">
      <Plus className="mr-2 h-4 w-4" />
      New Requisition
    </Button>
  );
}
