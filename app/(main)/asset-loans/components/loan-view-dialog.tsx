"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLoanDialog } from "./loan-dialog-provider";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

export function LoanViewDialog() {
  const { open, setOpen, currentLoan } = useLoanDialog();

  return (
    <Dialog open={open === "view"} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Loan Details</DialogTitle>
          <DialogDescription>
            Detailed information about the asset loan.
          </DialogDescription>
        </DialogHeader>

        {currentLoan && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Asset Code</Label>
                <div className="font-medium">
                  {currentLoan.asset.kode_asset}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Asset Name</Label>
                <div className="font-medium">
                  {currentLoan.asset.nama_asset}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Employee Name</Label>
                <div className="font-medium">{currentLoan.employee.nama}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">NIK</Label>
                <div className="font-medium">{currentLoan.employee.nik}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Loan Date</Label>
                <div className="font-medium">
                  {format(new Date(currentLoan.loanDate), "dd MMMM yyyy")}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Expected Return</Label>
                <div className="font-medium">
                  {currentLoan.returnDate
                    ? format(new Date(currentLoan.returnDate), "dd MMMM yyyy")
                    : "Not specified"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Status</Label>
                <div className="font-medium capitalize">
                  {currentLoan.status.toLowerCase()}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Actual Return</Label>
                <div className="font-medium">
                  {currentLoan.actualReturnDate
                    ? format(
                        new Date(currentLoan.actualReturnDate),
                        "dd MMMM yyyy",
                      )
                    : "-"}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">Notes</Label>
              <div className="p-2 bg-muted rounded-md text-sm whitespace-pre-wrap min-h-[60px]">
                {currentLoan.notes || "No notes provided."}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => setOpen(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
