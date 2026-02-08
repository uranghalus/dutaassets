/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDialog } from "@/context/dialog-provider";
import { WarehouseActionDialog } from "./warehouse-action-dialog";
import { WarehouseDeleteDialog } from "./warehouse-delete-dialog";
import { Warehouse } from "@/generated/prisma/client";

export default function WarehouseDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      {/* ADD */}
      <WarehouseActionDialog
        key="warehouse-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          {/* EDIT */}
          <WarehouseActionDialog
            key={`warehouse-edit-${(currentRow as Warehouse).id}`}
            open={open === "edit"}
            currentRow={currentRow as Warehouse}
            onOpenChange={() => {
              setOpen("edit");
              setCurrentRow(undefined);
            }}
          />

          {/* DELETE */}
          <WarehouseDeleteDialog />
        </>
      )}
    </>
  );
}
