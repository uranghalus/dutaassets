"use client";

import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDeleteItemCategoryBulk } from "@/hooks/use-item-category";

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>;
}

export function CategoryBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const deleteBulkMutation = useDeleteItemCategoryBulk();

  if (selectedRows.length === 0) {
    return null;
  }

  const handleDelete = () => {
    const ids = selectedRows.map((row) => (row.original as any).id);

    toast.promise(deleteBulkMutation.mutateAsync(ids), {
      loading: "Deleting categories...",
      success: () => {
        table.resetRowSelection();
        return "Categories deleted successfully";
      },
      error: "Failed to delete categories",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-muted-foreground">
        {selectedRows.length} selected
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="h-8 gap-2"
        onClick={handleDelete}
        disabled={deleteBulkMutation.isPending}
      >
        <Trash2 className="size-4" />
        {deleteBulkMutation.isPending ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
