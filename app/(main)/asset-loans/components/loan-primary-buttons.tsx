"use client";

import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";
import { useLoanDialog } from "./loan-dialog-provider";

export function LoanPrimaryButtons() {
  const { setOpen } = useLoanDialog();

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => setOpen("loan")} className="space-x-1">
        <span>Loan Asset</span>
        <Handshake className="h-4 w-4" />
      </Button>
    </div>
  );
}
