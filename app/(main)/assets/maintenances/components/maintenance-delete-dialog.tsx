"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDialog } from "@/context/dialog-provider";
import { useDeleteAssetMaintenance } from "@/hooks/use-asset-maintenance";

export function MaintenanceDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useDialog<any>();
  const deleteMutation = useDeleteAssetMaintenance();

  const handleClose = () => {
    setOpen(null);
    setCurrentRow(null);
  };

  const onConfirm = async () => {
    if (currentRow?.id) {
      await deleteMutation.mutateAsync(currentRow.id);
      handleClose();
    }
  };

  return (
    <AlertDialog
      open={open === "delete"}
      onOpenChange={(val) => !val && handleClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            maintenance record for{" "}
            <span className="font-semibold">
              {currentRow?.asset?.nama_asset}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
