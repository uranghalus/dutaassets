"use client";

import { SquarePen, Trash2, Users } from "lucide-react";
import { Row } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useDialog } from "@/context/dialog-provider";

import { TeamWithRelations } from "./teams-column";
// import { authClient } from "@/lib/auth-client";

type TeamRowActionsProps = {
  row: Row<TeamWithRelations>;
};

export function TeamRowActions({ row }: TeamRowActionsProps) {
  const { setOpen, setCurrentRow } = useDialog();
  // const { data: activeMember } = authClient.useActiveMember();

  // Basic permission check could go here if needed
  // const canManage = activeMember?.role === "owner" || activeMember?.role === "admin";
  // if (!canManage) return null;

  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/teams/${row.original.id}/members`}>
          <Users />
        </Link>
      </Button>

      {/* EDIT */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("edit");
        }}
      >
        <SquarePen />
      </Button>

      {/* DELETE */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("delete");
        }}
      >
        <Trash2 />
      </Button>
    </ButtonGroup>
  );
}
