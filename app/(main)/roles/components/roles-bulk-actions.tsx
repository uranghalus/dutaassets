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
import { OrganizationRole } from "@/generated/prisma/client";
import { OrgRoleMultiDeleteDialog } from "./roles-multi-delete-dialog";

type RolesBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function RolesBulkActions<TData>({
  table,
}: RolesBulkActionsProps<TData>) {
  const [openDelete, setOpenDelete] = useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedRoles = selectedRows.map(
    (row) => row.original as OrganizationRole,
  );

  const handleOpenDelete = () => {
    if (selectedRoles.length === 0) return;
    setOpenDelete(true);
  };

  return (
    <>
      <DataTableBulkActions table={table} entityName="role">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-8"
              onClick={handleOpenDelete}
              aria-label="Delete selected roles"
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete selected roles</TooltipContent>
        </Tooltip>
      </DataTableBulkActions>

      <OrgRoleMultiDeleteDialog
        table={table}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  );
}
