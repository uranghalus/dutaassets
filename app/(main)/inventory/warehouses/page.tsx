import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";

import { Metadata } from "next";

import WarehouseDialogs from "./components/warehouse-dialog";
import WarehousePrimaryButtons from "./components/warehouse-primary-buttons";
import { WarehouseTable } from "./components/warehouse-table";

export const metadata: Metadata = {
  title: "Warehouses",
  description: "Manage your inventory locations",
};
export default function WarehousePage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Warehouses</h2>
            <p className="text-muted-foreground">
              Manage your inventory warehouses and locations here.
            </p>
          </div>
          <WarehousePrimaryButtons />
        </div>
        <WarehouseTable />
      </Main>
      <WarehouseDialogs />
    </DialogProvider>
  );
}
