"use client";

import { useQuery } from "@tanstack/react-query";
import { getStockIssuances } from "@/action/stock-issuance-action";
import { toast } from "sonner";

export function useStockIssuances({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["stock-issuances", page, pageSize],
    queryFn: async () => {
      try {
        const response = await getStockIssuances({ page, pageSize });
        return response;
      } catch (error) {
        toast.error("Failed to fetch stock issuances");
        throw error;
      }
    },
  });
}
