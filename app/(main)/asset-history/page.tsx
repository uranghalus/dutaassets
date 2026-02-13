"use client";

import React, { useState } from "react";
import { Main } from "@/components/main";
import { HistoryTable } from "./components/history-table";
import { HistoryToolbar } from "./components/history-toolbar";

export default function AssetHistoryPage() {
  const [search, setSearch] = useState("");

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Asset History</h2>
          <p className="text-muted-foreground">
            Monitor every movement and modification of your organization's
            assets.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <HistoryToolbar onSearch={setSearch} searchValue={search} />
        <HistoryTable search={search} />
      </div>
    </Main>
  );
}
