"use client";

import { useDialog } from "@/context/dialog-provider";
import { CategoryActionDialog } from "./category-action-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { AssetCategory } from "@/generated/prisma/client";

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
            key={`category-edit-${(currentRow as AssetCategory).id}`}
            open={open === "edit"}
            currentRow={currentRow as AssetCategory}
            onOpenChange={() => {
              setOpen("edit");
              setCurrentRow(undefined);
            }}
          />

          {/* DELETE */}
          <CategoryDeleteDialog
            key={`category-delete-${(currentRow as AssetCategory).id}`}
          />
        </>
      )}
    </>
  );
}
