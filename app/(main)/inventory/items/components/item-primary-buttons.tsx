"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { Plus } from "lucide-react";

export default function ItemPrimaryButtons() {
  const { setOpen } = useDialog();
  return (
    <div className="flex gap-2">
      <Button onClick={() => setOpen("add")} className="space-x-1">
        <span>Add Item</span> <Plus size={18} />
      </Button>
    </div>
  );
}
