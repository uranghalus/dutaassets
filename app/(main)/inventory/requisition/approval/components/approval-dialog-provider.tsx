"use client";

import { Requisition, Karyawan, Warehouse } from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";

export type RequisitionWithRelations = Requisition & {
  requester: Karyawan;
  warehouse: Warehouse | null;
  _count: { items: number };
};

type ApprovalDialogContextType = {
  open: "approve" | "reject" | "view" | null;
  setOpen: (open: "approve" | "reject" | "view" | null) => void;
  currentRequisition: RequisitionWithRelations | null;
  setCurrentRequisition: (requisition: RequisitionWithRelations | null) => void;
};

const ApprovalDialogContext = createContext<
  ApprovalDialogContextType | undefined
>(undefined);

export function ApprovalDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<"approve" | "reject" | "view" | null>(null);
  const [currentRequisition, setCurrentRequisition] =
    useState<RequisitionWithRelations | null>(null);

  return (
    <ApprovalDialogContext.Provider
      value={{ open, setOpen, currentRequisition, setCurrentRequisition }}
    >
      {children}
    </ApprovalDialogContext.Provider>
  );
}

export function useApprovalDialog() {
  const context = useContext(ApprovalDialogContext);
  if (!context) {
    throw new Error(
      "useApprovalDialog must be used within ApprovalDialogProvider",
    );
  }
  return context;
}
