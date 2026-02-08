"use client";

import { useDialog } from "@/context/dialog-provider";
import { RequisitionActionDialog } from "./requisition-action-dialog";
import { RequisitionDetailsDialog } from "./requisition-details-dialog";
import {
  Requisition,
  Karyawan,
  RequisitionItem,
  Item,
} from "@/generated/prisma/client";

type RequisitionWithRelations = Requisition & {
  requester: Karyawan;
  items: (RequisitionItem & { item: Item })[];
};

export default function RequisitionDialogs() {
  const { open, setOpen, currentRow } = useDialog<RequisitionWithRelations>();
  return (
    <>
      <RequisitionActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
      />
      <RequisitionDetailsDialog
        open={open === "view"}
        onOpenChange={() => setOpen(null)}
        requisition={currentRow}
      />
    </>
  );
}
