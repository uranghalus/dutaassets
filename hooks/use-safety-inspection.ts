"use client";

import { useQuery } from "@tanstack/react-query";
import { getSafetyInspections } from "@/action/safety-inspection-action";
import { toast } from "sonner";

export function useSafetyInspections({
  page = 0,
  pageSize = 10,
  equipmentId,
}: {
  page?: number;
  pageSize?: number;
  equipmentId?: string;
}) {
  return useQuery({
    queryKey: ["safety-inspections", page, pageSize, equipmentId],
    queryFn: async () => {
      try {
        const response = await getSafetyInspections({
          page,
          pageSize,
          equipmentId,
        });
        return response;
      } catch (error) {
        toast.error("Failed to fetch safety inspections");
        throw error;
      }
    },
  });
}
