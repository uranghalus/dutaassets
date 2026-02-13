import React, { Suspense } from "react";
import { Main } from "@/components/main";
import { Metadata } from "next";
import { getPaginatedStockList } from "@/action/stock-action";
import { StockTable } from "./components/stock-table";
import { StockToolbar } from "./components/stock-toolbar";
import { StockPagination } from "./components/stock-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Inventory Stock Status",
  description: "Consolidated view of all items across all warehouses.",
};

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  warehouseId?: string;
}

export default async function StocksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search;
  const warehouseId = params.warehouseId;

  const data = await getPaginatedStockList({
    page,
    pageSize: limit,
    search,
    warehouseId,
  });

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Status</h2>
          <p className="text-muted-foreground">
            Monitor real-time inventory levels across your organization.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <StockToolbar />

        <Suspense fallback={<StockTableSkeleton />}>
          <StockTable data={data.data} />
        </Suspense>

        <StockPagination
          pageCount={data.pageCount}
          currentPage={data.page}
          pageSize={data.pageSize}
          total={data.total}
        />
      </div>
    </Main>
  );
}

function StockTableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
