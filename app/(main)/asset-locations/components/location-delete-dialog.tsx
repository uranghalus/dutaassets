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
import { useDeleteAssetLocation } from "@/hooks/use-asset-location";

export function LocationDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useDialog<any>();
  const deleteMutation = useDeleteAssetLocation();

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
            location <span className="font-semibold">{currentRow?.name}</span>.
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
