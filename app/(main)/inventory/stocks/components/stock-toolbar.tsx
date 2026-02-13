"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useAllWarehouses } from "@/hooks/use-warehouse";

import { ExportButton } from "@/components/import-export/export-button";
import { getStocksForExport } from "@/action/stock-action";

export function StockToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search")?.toString() || "",
  );

  const { data: warehouses } = useAllWarehouses();

  const search = searchParams.get("search") || "";
  const warehouseId = searchParams.get("warehouseId") || "";

  const stockHeaders = [
    { label: "Item Code", key: "code" },
    { label: "Item Name", key: "name" },
    { label: "Unit", key: "unit" },
    { label: "Category", key: "category" },
    { label: "Total Stock", key: "totalStock" },
    { label: "Warehouse Details", key: "warehouseDetails" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    params.set("page", "1");

    const timeout = setTimeout(() => {
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, pathname, router]);

  const handleWarehouseChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("warehouseId");
    } else {
      params.set("warehouseId", value);
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center justify-between gap-2 border rounded-md p-3 bg-card">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter items..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-10 w-[150px] lg:w-[250px]"
        />

        <Select
          defaultValue={searchParams.get("warehouseId")?.toString() || "all"}
          onValueChange={handleWarehouseChange}
        >
          <SelectTrigger className="h-10 w-[150px] lg:w-[200px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses?.data?.map((warehouse: any) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ExportButton
        fileName="stock_status"
        headers={stockHeaders}
        onExportCurrentPage={() => getStocksForExport({ search, warehouseId })}
        onExportAll={() => getStocksForExport({ search, warehouseId })}
      />
    </div>
  );
}
