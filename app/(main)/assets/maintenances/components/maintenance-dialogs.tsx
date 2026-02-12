"use client";

import { MaintenanceActionDialog } from "./maintenance-action-dialog";
import { MaintenanceDeleteDialog } from "./maintenance-delete-dialog";

export default function MaintenanceDialogs() {
  return (
    <>
      <MaintenanceActionDialog />
      <MaintenanceDeleteDialog />
    </>
  );
}
