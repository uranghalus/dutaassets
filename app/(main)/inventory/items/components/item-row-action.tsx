"use client";

import { SquarePen, Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useDialog } from "@/context/dialog-provider";

import { Item } from "@/generated/prisma/client";

type ItemRowActionsProps = {
  row: Row<Item>;
};

export function ItemRowActions({ row }: ItemRowActionsProps) {
  const { setOpen, setCurrentRow } = useDialog();

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
