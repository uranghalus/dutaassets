"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLoanDialog } from "./loan-dialog-provider";
import { useReturnAssetLoan } from "@/hooks/use-asset-loan";

export function LoanReturnDialog() {
  const { open, setOpen, currentLoan } = useLoanDialog();
  const returnMutation = useReturnAssetLoan();
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open === "return" && currentLoan) {
      setNotes(currentLoan.notes || "");
    }
  }, [open, currentLoan]);

  const handleReturn = async () => {
    if (!currentLoan) return;
    await returnMutation.mutateAsync({ id: currentLoan.id, notes });
    setOpen(null);
  };

  const isLoading = returnMutation.isPending;

  return (
    <Dialog open={open === "return"} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Asset</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this asset as returned? This will make
            the asset available again.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="asset-info">Asset</Label>
            <div id="asset-info" className="text-sm font-medium">
              {currentLoan?.asset.kode_asset} - {currentLoan?.asset.nama_asset}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-info">Employee</Label>
            <div id="employee-info" className="text-sm font-medium">
              {currentLoan?.employee.nama}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="return-notes">Return Notes (Optional)</Label>
            <Textarea
              id="return-notes"
              placeholder="Add any notes about the return condition..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(null)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleReturn} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
