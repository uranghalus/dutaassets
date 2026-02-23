"use client";

import { AlertTriangle } from "lucide-react";
import { type Table } from "@tanstack/react-table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/confirm-dialog";

import { Asset } from "@/generated/prisma/client";
import { useDeleteAssetsBulk } from "@/hooks/use-asset";

type AssetMultiDeleteDialogProps<TData> = {
  table: Table<TData>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssetMultiDeleteDialog<TData>({
  table,
  open,
  onOpenChange,
}: AssetMultiDeleteDialogProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const assets = selectedRows.map((row) => row.original as Asset);

  const { mutate, isPending } = useDeleteAssetsBulk();

  const handleDelete = async () => {
    mutate(
      assets.map((a) => a.id_barang),
      {
        onSuccess: () => {
          table.resetRowSelection();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={isPending}
      title={
        <span className="text-destructive flex items-center gap-2">
          <AlertTriangle className="size-4" />
          Delete Assets
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{assets.length}</span> asset
            {assets.length > 1 ? "s" : ""}?
          </p>

          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action will permanently delete the selected assets. This
              cannot be undone.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
