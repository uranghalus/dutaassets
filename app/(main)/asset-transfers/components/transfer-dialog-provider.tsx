"use client";

import {
  Asset,
  AssetTransfer,
  Karyawan,
  AssetLocation,
} from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";

export type TransferWithRelations = AssetTransfer & {
  asset: Asset;
  fromLocation: AssetLocation | null;
  toLocation: AssetLocation | null;
  fromEmployee: Karyawan | null;
  toEmployee: Karyawan | null;
};

type TransferDialogContextType = {
  open: "create" | "approve" | "complete" | "view" | "delete" | null;
  setOpen: (
    open: "create" | "approve" | "complete" | "view" | "delete" | null,
  ) => void;
  currentTransfer: TransferWithRelations | null;
  setCurrentTransfer: (transfer: TransferWithRelations | null) => void;
};

const TransferDialogContext = createContext<
  TransferDialogContextType | undefined
>(undefined);

export function TransferDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<
    "create" | "approve" | "complete" | "view" | "delete" | null
  >(null);
  const [currentTransfer, setCurrentTransfer] =
    useState<TransferWithRelations | null>(null);

  return (
    <TransferDialogContext.Provider
      value={{ open, setOpen, currentTransfer, setCurrentTransfer }}
    >
      {children}
    </TransferDialogContext.Provider>
  );
}

export function useTransferDialog() {
  const context = useContext(TransferDialogContext);
  if (!context) {
    throw new Error(
      "useTransferDialog must be used within TransferDialogProvider",
    );
  }
  return context;
}
