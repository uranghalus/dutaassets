"use client";

import { Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useDialog } from "@/context/dialog-provider";

import { TeamMember } from "./members-column";

type MemberRowActionsProps = {
  row: Row<TeamMember>;
};

export function MemberRowActions({ row }: MemberRowActionsProps) {
  const { setOpen, setCurrentRow } = useDialog();

  return (
    <ButtonGroup>
      {/* REMOVE MEMBER */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          // Need to pass both teamId and userId.
          // We can pass the whole row object and extract it in dialog
          setCurrentRow(row.original);
          setOpen("delete"); // Treating removal as 'delete' context
        }}
      >
        <Trash2 />
      </Button>
    </ButtonGroup>
  );
}
