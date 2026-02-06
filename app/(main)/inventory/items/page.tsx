import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";

import { Metadata } from "next";

import ItemDialogs from "./components/item-dialog";
import ItemPrimaryButtons from "./components/item-primary-buttons";
import { ItemTable } from "./components/item-table";

export const metadata: Metadata = {
  title: "Master Items",
  description: "Manage your supply master data",
};
export default function ItemPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Master Items</h2>
            <p className="text-muted-foreground">
              Manage your consumables and supply types here.
            </p>
          </div>
          <ItemPrimaryButtons />
        </div>
        <ItemTable />
      </Main>
      <ItemDialogs />
    </DialogProvider>
  );
}
