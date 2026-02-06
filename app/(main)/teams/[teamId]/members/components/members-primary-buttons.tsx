"use client";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { Plus } from "lucide-react";
import React from "react";

export default function MembersPrimaryButton() {
  const { setOpen } = useDialog();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add Member</span> <Plus size={18} />
      </Button>
    </div>
  );
}
