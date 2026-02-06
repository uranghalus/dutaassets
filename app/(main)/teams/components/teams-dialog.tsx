/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDialog } from "@/context/dialog-provider";
import { TeamActionDialog } from "./teams-action-dialog";
import { TeamDeleteDialog } from "./teams-delete-dialog";
import { TeamWithRelations } from "./teams-column";

export default function TeamsDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      {/* ADD */}
      <TeamActionDialog
        key="team-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          {/* EDIT */}
          <TeamActionDialog
            key={`team-edit-${(currentRow as TeamWithRelations).id}`}
            open={open === "edit"}
            currentRow={currentRow as TeamWithRelations}
            onOpenChange={() => {
              setOpen("edit");
              setCurrentRow(undefined);
            }}
          />

          {/* DELETE */}
          <TeamDeleteDialog
            key={`team-delete-${(currentRow as TeamWithRelations).id}`}
            open={open === "delete"}
            currentRow={currentRow as TeamWithRelations}
            onOpenChange={() => {
              setOpen("delete");
              setCurrentRow(undefined);
            }}
          />
        </>
      )}
    </>
  );
}
