"use client";

import { useQuery } from "@tanstack/react-query";
import { getLowStockReportData } from "@/action/report-action";

export function useLowStockReport() {
  return useQuery({
    queryKey: ["reports", "low-stock"],
    queryFn: () => getLowStockReportData(),
  });
}
