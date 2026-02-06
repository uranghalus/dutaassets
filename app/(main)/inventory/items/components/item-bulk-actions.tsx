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
  DialogTrigger,
} from "@/components/ui/dialog";

import { DataTableBulkActions } from "@/components/datatable/datatable-bulk-action";
import { useDeleteItemBulk } from "@/hooks/use-item";
import { Item } from "@/generated/prisma/client";

interface ItemBulkActionsProps<TData> {
  table: Table<TData>;
}

export function ItemBulkActions<TData>({ table }: ItemBulkActionsProps<TData>) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteBulk, isPending } = useDeleteItemBulk();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const selectedIds = useMemo(
    () => selectedRows.map((row) => (row.original as unknown as Item).id),
    [selectedRows],
  );

  const handleDelete = async () => {
    await deleteBulk(selectedIds);
    setOpen(false);
    table.resetRowSelection();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataTableBulkActions table={table} entityName="item">
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
            <span className="font-bold">{selectedRows.length}</span> items.
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
