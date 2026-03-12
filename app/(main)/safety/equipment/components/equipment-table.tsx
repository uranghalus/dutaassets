"use client";

import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { equipmentColumns } from "./equipment-columns";
import { useSafetyEquipments } from "@/hooks/use-safety-equipment";
import { SafetyEquipment, Asset, Item } from "@/generated/prisma/client";

type SafetyEquipmentWithRelations = SafetyEquipment & {
  asset: Asset & { item: Pick<Item, "code" | "name"> | null };
  inspections: { id: string }[];
};

export function EquipmentTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useSafetyEquipments({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns: equipmentColumns as any,
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
