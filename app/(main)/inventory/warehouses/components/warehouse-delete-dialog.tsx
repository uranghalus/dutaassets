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
import { Warehouse } from "@/generated/prisma/client";
import { useDeleteWarehouse } from "@/hooks/use-warehouse";

import { toast } from "sonner"; // Assuming sonner or similar toast

export function WarehouseDeleteDialog() {
  const { open, setOpen, currentRow } = useDialog();
  const deleteMutation = useDeleteWarehouse();
  const warehouse = currentRow as Warehouse;

  const handleDelete = () => {
    deleteMutation.mutate(warehouse.id, {
      onSuccess: () => {
        toast.success("Warehouse deleted successfully");
        setOpen(null);
      },
      onError: () => {
        toast.error("Failed to delete warehouse");
      },
    });
  };

  return (
    <AlertDialog
      open={open === "delete"}
      onOpenChange={(val) => {
        if (!val) setOpen(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            warehouse <span className="font-bold">{warehouse?.name}</span> and
            remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
