"use client";

import { SquarePen, Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useDialog } from "@/context/dialog-provider";

import type { OrganizationRole } from "@/generated/prisma/client";
import { useHasPermission } from "@/hooks/use-role-permission";
import { authClient } from "@/lib/auth-client";

type RoleRowActionsProps = {
  row: Row<OrganizationRole>;
};

const PROTECTED_ROLES = ["owner", "admin", "member"];

export function RoleRowActions({ row }: RoleRowActionsProps) {
  const { setOpen, setCurrentRow } = useDialog();
  const { data: activeMember } = authClient.useActiveMember();

  const { data, isLoading } = useHasPermission({
    role: ["update", "delete"],
  });

  const canManageRole =
    data?.success === true ||
    activeMember?.role === "owner" ||
    activeMember?.role === "admin";
  const isProtected = PROTECTED_ROLES.includes(row.original.role);

  if (isLoading || !canManageRole) {
    return null;
  }

  return (
    <ButtonGroup>
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
      {!isProtected && (
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
      )}
    </ButtonGroup>
  );
}
