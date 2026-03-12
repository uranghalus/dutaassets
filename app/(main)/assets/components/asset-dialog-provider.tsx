"use client";

import {
  Asset,
  Department,
  Divisi,
  Karyawan,
  Category,
  AssetLocation,
  Item,
} from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";

export type AssetWithRelations = Asset & {
  department_fk: Department;
  divisi_fk?: Divisi | null;
  karyawan_fk?: Karyawan | null;
  assetCategory?: Category | null;
  assetLocation?: AssetLocation | null;
  item?: Item | null;
};

type AssetDialogContextType = {
  open: "add" | "edit" | "delete" | "view" | "multi-delete" | "dispose" | null;
  setOpen: (
    open:
      | "add"
      | "edit"
      | "delete"
      | "view"
      | "multi-delete"
      | "dispose"
      | null,
  ) => void;
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
  const [open, setOpen] = useState<
    "add" | "edit" | "delete" | "view" | "multi-delete" | "dispose" | null
  >(null);
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
