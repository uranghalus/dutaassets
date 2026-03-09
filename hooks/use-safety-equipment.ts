"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSafetyEquipments,
  getSafetyEquipmentsForSelect,
} from "@/action/safety-equipment-action";
import { toast } from "sonner";

export function useSafetyEquipments({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["safety-equipments", page, pageSize],
    queryFn: async () => {
      try {
        const response = await getSafetyEquipments({ page, pageSize });
        return response;
      } catch (error) {
        toast.error("Failed to fetch safety equipments");
        throw error;
      }
    },
  });
}

export function useSafetyEquipmentsForSelect() {
  return useQuery({
    queryKey: ["safety-equipments-select"],
    queryFn: async () => {
      try {
        const response = await getSafetyEquipmentsForSelect();
        return response;
      } catch (error) {
        toast.error("Failed to fetch safety equipments");
        throw error;
      }
    },
  });
}
