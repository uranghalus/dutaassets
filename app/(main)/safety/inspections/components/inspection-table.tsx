"use client";

import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { inspectionColumns } from "./inspection-columns";
import { useSafetyInspections } from "@/hooks/use-safety-inspection";
import {
  SafetyInspection,
  SafetyEquipment,
  Asset,
  Item,
  SafetyInspectionItem,
  User,
} from "@/generated/prisma/client";
type SafetyInspectionWithRelations = SafetyInspection & {
  equipment: SafetyEquipment & {
    asset: Asset & { item: Pick<Item, "name" | "code"> | null };
  };
  inspector: Pick<User, "id" | "name"> | null;
  items: SafetyInspectionItem[];
};

export function InspectionTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useSafetyInspections({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns: inspectionColumns as any,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="nama_asset"
        searchPlaceholder="Search equipment..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
