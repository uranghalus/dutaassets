/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDialog } from "@/context/dialog-provider";
import { ItemActionDialog } from "./item-action-dialog";
import { ItemDeleteDialog } from "./item-delete-dialog";
import { Item } from "@/generated/prisma/client";

export default function ItemDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      {/* ADD */}
      <ItemActionDialog
        key="item-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          {/* EDIT */}
          <ItemActionDialog
            key={`item-edit-${(currentRow as Item).id}`}
            open={open === "edit"}
            currentRow={currentRow as Item}
            onOpenChange={() => {
              setOpen("edit");
              setCurrentRow(undefined);
            }}
          />

          {/* DELETE */}
          <ItemDeleteDialog key={`item-delete-${(currentRow as Item).id}`} />
        </>
      )}
    </>
  );
}
