import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import MaintenanceDialogs from "./components/maintenance-dialogs";
import MaintenancePrimaryButtons from "./components/maintenance-primary-buttons";
import { MaintenanceTable } from "./components/maintenance-table";

export const metadata: Metadata = {
  title: "Asset Maintenance",
  description: "Track and manage asset repairs and preventive maintenance.",
};

export default function AssetMaintenancesPage() {
  return (
    <DialogProvider>
      <Main fluid>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Asset Maintenance
            </h2>
            <p className="text-muted-foreground">
              Manage histories of repairs and maintenance for your fixed assets.
            </p>
          </div>
          <MaintenancePrimaryButtons />
        </div>
        <MaintenanceTable />
      </Main>
      <MaintenanceDialogs />
    </DialogProvider>
  );
}
