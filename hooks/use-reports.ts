"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  getAssetReportData, 
  getMaintenanceReportData, 
  getInventoryReportData 
} from "@/action/report-action";

export function useAssetReport() {
  return useQuery({
    queryKey: ["reports", "assets"],
    queryFn: () => getAssetReportData(),
  });
}

export function useMaintenanceReport() {
  return useQuery({
    queryKey: ["reports", "maintenance"],
    queryFn: () => getMaintenanceReportData(),
  });
}

export function useInventoryReport() {
  return useQuery({
    queryKey: ["reports", "inventory"],
    queryFn: () => getInventoryReportData(),
  });
}
