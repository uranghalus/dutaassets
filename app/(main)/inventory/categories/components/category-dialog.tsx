"use client";

import { useDialog } from "@/context/dialog-provider";
import { CategoryActionDialog } from "./category-action-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { ItemCategory } from "@/generated/prisma/client";

export default function CategoryDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      {/* ADD */}
      <CategoryActionDialog
        key="category-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          {/* EDIT */}
          <CategoryActionDialog
            key={`category-edit-${(currentRow as ItemCategory).id}`}
            open={open === "edit"}
            currentRow={currentRow as ItemCategory}
            onOpenChange={() => {
              setOpen("edit");
              setCurrentRow(undefined);
            }}
          />

          {/* DELETE */}
          <CategoryDeleteDialog
            key={`category-delete-${(currentRow as ItemCategory).id}`}
          />
        </>
      )}
    </>
  );
}
