import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";

import { Metadata } from "next";

import TeamsDialogs from "./components/teams-dialog";
import TeamsPrimaryButton from "./components/teams-primary-buttons";
import { TeamsTable } from "./components/teams-table";

export const metadata: Metadata = {
  title: "Teams",
  description: "Halaman Management Team",
};
export default function TeamsPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Teams</h2>
            <p className="text-muted-foreground">
              Kelola Team organisasi Anda di sini.
            </p>
          </div>
          <TeamsPrimaryButton />
        </div>
        <TeamsTable />
      </Main>
      <TeamsDialogs />
    </DialogProvider>
  );
}
