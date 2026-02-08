"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAssetDialog } from "./asset-dialog-provider";

export function AssetPrimaryButtons() {
  const { setOpen } = useAssetDialog();

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => setOpen("add")} className="space-x-1">
        <span>New Asset</span>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
