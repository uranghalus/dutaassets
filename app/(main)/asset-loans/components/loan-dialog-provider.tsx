"use client";

import { Asset, AssetLoan, Karyawan } from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";

type LoanWithRelations = AssetLoan & {
  asset: Asset;
  employee: Karyawan;
};

type LoanDialogContextType = {
  open: "loan" | "return" | "delete" | "view" | null;
  setOpen: (open: "loan" | "return" | "delete" | "view" | null) => void;
  currentLoan: LoanWithRelations | null;
  setCurrentLoan: (loan: LoanWithRelations | null) => void;
};

const LoanDialogContext = createContext<LoanDialogContextType | undefined>(
  undefined,
);

export function LoanDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<
    "loan" | "return" | "delete" | "view" | null
  >(null);
  const [currentLoan, setCurrentLoan] = useState<LoanWithRelations | null>(
    null,
  );

  return (
    <LoanDialogContext.Provider
      value={{ open, setOpen, currentLoan, setCurrentLoan }}
    >
      {children}
    </LoanDialogContext.Provider>
  );
}

export function useLoanDialog() {
  const context = useContext(LoanDialogContext);
  if (!context) {
    throw new Error("useLoanDialog must be used within LoanDialogProvider");
  }
  return context;
}
