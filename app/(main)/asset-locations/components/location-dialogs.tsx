"use client";

import { LocationActionDialog } from "./location-action-dialog";
import { LocationDeleteDialog } from "./location-delete-dialog";

export default function LocationDialogs() {
  return (
    <>
      <LocationActionDialog />
      <LocationDeleteDialog />
    </>
  );
}
