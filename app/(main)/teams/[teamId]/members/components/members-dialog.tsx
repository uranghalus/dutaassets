/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDialog } from "@/context/dialog-provider";
import { MemberActionDialog } from "./members-action-dialog";
import { MemberDeleteDialog } from "./members-delete-dialog";
import { TeamMember } from "./members-column";

export default function MembersDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      {/* ADD */}
      <MemberActionDialog
        key="member-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          {/* DELETE */}
          <MemberDeleteDialog
            key={`member-delete-${(currentRow as TeamMember).id}`}
            open={open === "delete"}
            currentRow={currentRow as TeamMember}
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
