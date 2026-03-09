import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import { EquipmentDialogs } from "./components/equipment-dialog";
import { EquipmentPrimaryButtons } from "./components/equipment-primary-buttons";
import { EquipmentTable } from "./components/equipment-table";

export const metadata: Metadata = {
  title: "Safety Equipment",
  description: "Manage APAR and Hydrant safety equipment.",
};

export default function SafetyEquipmentPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Safety Equipment
            </h2>
            <p className="text-muted-foreground">
              Manage APAR and Hydrant equipment registered in the system.
            </p>
          </div>
          <EquipmentPrimaryButtons />
        </div>

        <EquipmentTable />
      </Main>
      <EquipmentDialogs />
    </DialogProvider>
  );
}
