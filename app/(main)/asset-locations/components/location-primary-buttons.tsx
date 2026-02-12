"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";

export default function LocationPrimaryButtons() {
  const { setOpen, setCurrentRow } = useDialog();

  return (
    <Button
      onClick={() => {
        setOpen("add");
        setCurrentRow(null);
      }}
    >
      + New Location
    </Button>
  );
}
