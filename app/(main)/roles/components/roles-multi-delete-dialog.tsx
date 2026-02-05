"use client";

import { AlertTriangle } from "lucide-react";
import { type Table } from "@tanstack/react-table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { OrganizationRole } from "@/generated/prisma/client";
import { useDeleteOrgRolesBulk } from "@/hooks/use-organization-role";

type OrgRoleMultiDeleteDialogProps<TData> = {
  table: Table<TData>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrgRoleMultiDeleteDialog<TData>({
  table,
  open,
  onOpenChange,
}: OrgRoleMultiDeleteDialogProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const roles = selectedRows.map((row) => row.original as OrganizationRole);

  const { mutate, isPending } = useDeleteOrgRolesBulk();

  const handleDelete = async () => {
    mutate(
      roles.map((e) => e.id),
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
          Delete Roles
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{roles.length}</span> role
            {roles.length > 1 ? "s" : ""}?
          </p>

          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action will permanently delete the selected roles. This
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
