import React from "react";
import { Main } from "@/components/main";
import { Metadata } from "next";
import { ActivityLogTable } from "./components/activity-log-table";

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "View system activity and audit trails.",
};

export default function AuditLogPage() {
  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">
            Monitor all significant system activities and data changes.
          </p>
        </div>
      </div>

      <ActivityLogTable />
    </Main>
  );
}
