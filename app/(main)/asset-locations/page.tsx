import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { Metadata } from "next";

import LocationDialogs from "./components/location-dialogs";
import LocationPrimaryButtons from "./components/location-primary-buttons";
import { LocationTable } from "./components/location-table";

export const metadata: Metadata = {
  title: "Asset Locations",
  description: "Manage storage and usage locations for your assets.",
};

export default function AssetLocationsPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Asset Locations
            </h2>
            <p className="text-muted-foreground">
              Configure and manage locations where assets are stored or
              assigned.
            </p>
          </div>
          <LocationPrimaryButtons />
        </div>
        <LocationTable />
      </Main>
      <LocationDialogs />
    </DialogProvider>
  );
}
