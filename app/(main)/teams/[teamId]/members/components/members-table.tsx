/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { useDataTable } from "@/hooks/use-data-table";
import { useTeamMembers } from "@/hooks/use-team-members";
import { memberColumns, TeamMember } from "./members-column";

export function MembersTable() {
  const params = useParams();
  const teamId = params.teamId as string;

  const { data: members, isLoading } = useTeamMembers(teamId);

  // Simplification: Client-side pagination for now as API might be list
  // If API supports pagination, we update this similar to TeamsTable
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { table } = useDataTable({
    data: (members ?? []) as TeamMember[],
    columns: memberColumns,
    columnResizeMode: "onEnd",

    pageCount: Math.ceil((members?.length ?? 0) / pagination.pageSize), // Client side calc
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="user" // Needs custom filter logic likely, or just search by name if accessor allows
        searchPlaceholder="Search member..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={table.getPageCount()} />
    </div>
  );
}
