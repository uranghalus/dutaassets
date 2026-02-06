"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { Plus } from "lucide-react";

export default function CategoryPrimaryButtons() {
  const { setOpen } = useDialog();

  return (
    <div className="flex gap-2">
      <Button onClick={() => setOpen("add")} className="gap-2">
        <Plus className="size-4" />
        Add Category
      </Button>
    </div>
  );
}
