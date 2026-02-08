"use client";

import { useMemo, useState } from "react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, // Keep DialogTrigger for Dialog component
} from "@/components/ui/dialog";
// The instruction implies a change to the import path for DataTableBulkActions.
// The provided snippet also includes a change to the Dialog import,
// specifically replacing DialogTrigger with TooltipTrigger and changing the import path to tooltip.
// However, the component still uses <Dialog> and <DialogTrigger> in its JSX.
// To maintain syntactical correctness and align with the primary instruction,
// I will only apply the change to the DataTableBulkActions import path.
// If the intention was to switch to Tooltip, more extensive changes would be needed in the JSX.

import { DataTableBulkActions } from "@/components/datatable/datatable-bulk-action"; // Changed from -actions to -action
import { useDeleteWarehouseBulk } from "@/hooks/use-warehouse";
import { Warehouse } from "@/generated/prisma/client";

interface WarehouseBulkActionsProps<TData> {
  table: Table<TData>;
}

export function WarehouseBulkActions<TData>({
  table,
}: WarehouseBulkActionsProps<TData>) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteBulk, isPending } = useDeleteWarehouseBulk();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const selectedIds = useMemo(
    () => selectedRows.map((row) => (row.original as unknown as Warehouse).id),
    [selectedRows],
  );

  const handleDelete = async () => {
    await deleteBulk(selectedIds);
    setOpen(false);
    table.resetRowSelection();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataTableBulkActions table={table} entityName="Warehouses">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Delete Selected
          </Button>
        </DialogTrigger>
      </DataTableBulkActions>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-bold">{selectedRows.length}</span> warehouses.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
