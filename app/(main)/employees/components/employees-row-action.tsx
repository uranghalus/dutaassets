"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useDialog } from "@/context/dialog-provider";
import { authClient } from "@/lib/auth-client";

import { EmployeeWithDivisi } from "@/types/employee";
import { Row } from "@tanstack/react-table";
import { Eye, SquarePen, Trash2, UserPlus, UserX } from "lucide-react";

type DataTableRowActionsProps = {
  row: Row<EmployeeWithDivisi>;
};

export default function EmployeesRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useDialog();

  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();

  /* =========================
       ROLE CHECK (CORRECT)
    ========================= */
  const myMember = activeOrg?.members?.find(
    (m) => m.userId === session?.user?.id,
  );

  const isAdmin = myMember?.role === "owner" || myMember?.role === "admin";

  const isLinked = !!row.original.userId;

  return (
    <ButtonGroup>
      {/* =====================
               VIEW DETAILS
            ===================== */}
      <Button variant="outline" size="sm" asChild title="View Details">
        <Link href={`/employees/${row.original.id_karyawan}`}>
          <Eye className="size-4" />
        </Link>
      </Button>
      {/* =====================
               SYNC USER
            ===================== */}
      {isAdmin && !isLinked && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("sync-user");
          }}
          title="Sync user"
        >
          <UserPlus className="size-4" />
        </Button>
      )}

      {/* =====================
               UNLINK USER
            ===================== */}
      {isAdmin && isLinked && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("unsync-user");
          }}
          title="Unlink user"
        >
          <UserX className="size-4" />
        </Button>
      )}

      {/* =====================
               EDIT
            ===================== */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("edit");
        }}
      >
        <SquarePen className="size-4" />
      </Button>

      {/* =====================
               DELETE
            ===================== */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("delete");
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    </ButtonGroup>
  );
}
