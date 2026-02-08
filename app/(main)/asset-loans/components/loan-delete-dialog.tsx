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
import { useDeleteAssetLoan } from "@/hooks/use-asset-loan";

export function LoanDeleteDialog() {
  const { open, setOpen, currentLoan } = useLoanDialog();
  const deleteMutation = useDeleteAssetLoan();

  const handleDelete = async () => {
    if (!currentLoan) return;
    await deleteMutation.mutateAsync(currentLoan.id);
    setOpen(null);
  };

  const isLoading = deleteMutation.isPending;

  return (
    <Dialog open={open === "delete"} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Delete Loan Record
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this loan record? This action cannot
            be undone. If the asset is currently on loan, its status will be
            reset to AVAILABLE.
          </DialogDescription>
        </DialogHeader>

        {currentLoan && (
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asset:</span>
              <span className="font-medium">
                {currentLoan.asset.nama_asset}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employee:</span>
              <span className="font-medium">{currentLoan.employee.nama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium capitalize">
                {currentLoan.status.toLowerCase()}
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(null)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
