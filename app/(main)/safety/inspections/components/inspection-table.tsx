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
  SafetyInspectionItem,
  User,
} from "@/generated/prisma/client";

type SafetyInspectionWithRelations = SafetyInspection & {
  equipment: SafetyEquipment & {
    asset: Pick<Asset, "nama_asset" | "kode_asset">;
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
    data: (data?.data ?? []) as unknown as SafetyInspectionWithRelations[],
    columns: inspectionColumns,
    columnResizeMode: "onEnd",

    pageCount: data?.pageCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="asset_name"
        searchPlaceholder="Search equipment..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination table={table} pageCount={data?.pageCount ?? 0} />
    </div>
  );
}
