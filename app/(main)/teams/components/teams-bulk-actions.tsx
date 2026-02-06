"use client";

import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableBulkActions } from "@/components/datatable/datatable-bulk-action";
// import { TeamsMultiDeleteDialog } from "./teams-multi-delete-dialog";
// Note: Can implement multi-delete dialog later or now. I'll make a basic placeholder or standard one.

type TeamsBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function TeamsBulkActions<TData>({
  table,
}: TeamsBulkActionsProps<TData>) {
  const [openDelete, setOpenDelete] = useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleOpenDelete = () => {
    if (selectedRows.length === 0) return;
    setOpenDelete(true);
  };

  return (
    <>
      <DataTableBulkActions table={table} entityName="team">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-8"
              onClick={handleOpenDelete}
              aria-label="Delete selected teams"
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete selected teams</TooltipContent>
        </Tooltip>
      </DataTableBulkActions>

      {/* Placeholder for Multi Delete Dialog if needed */}
      {/* <TeamsMultiDeleteDialog
        table={table}
        open={openDelete}
        onOpenChange={setOpenDelete}
      /> */}
    </>
  );
}
