"use client";

import { Asset, Department, Divisi, Karyawan } from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";

type AssetWithRelations = Asset & {
  department_fk: Department;
  divisi_fk?: Divisi | null;
  karyawan_fk?: Karyawan | null;
};

type AssetDialogContextType = {
  open: "add" | "edit" | "delete" | "view" | null;
  setOpen: (open: "add" | "edit" | "delete" | "view" | null) => void;
  currentAsset: AssetWithRelations | null;
  setCurrentAsset: (asset: AssetWithRelations | null) => void;
};

const AssetDialogContext = createContext<AssetDialogContextType | undefined>(
  undefined,
);

export function AssetDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<"add" | "edit" | "delete" | "view" | null>(
    null,
  );
  const [currentAsset, setCurrentAsset] = useState<AssetWithRelations | null>(
    null,
  );

  return (
    <AssetDialogContext.Provider
      value={{ open, setOpen, currentAsset, setCurrentAsset }}
    >
      {children}
    </AssetDialogContext.Provider>
  );
}

export function useAssetDialog() {
  const context = useContext(AssetDialogContext);
  if (!context) {
    throw new Error("useAssetDialog must be used within AssetDialogProvider");
  }
  return context;
}
