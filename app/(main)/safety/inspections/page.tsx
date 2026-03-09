import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import { InspectionDialogs } from "./components/inspection-dialog";
import { InspectionPrimaryButtons } from "./components/inspection-primary-buttons";
import { InspectionTable } from "./components/inspection-table";

export const metadata: Metadata = {
  title: "Safety Inspections",
  description: "Record and view daily safety equipment inspection logs.",
};

export default function SafetyInspectionPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Safety Inspections
            </h2>
            <p className="text-muted-foreground">
              Record daily inspection logs for APAR and Hydrant equipment per
              shift.
            </p>
          </div>
          <InspectionPrimaryButtons />
        </div>

        <InspectionTable />
      </Main>
      <InspectionDialogs />
    </DialogProvider>
  );
}
