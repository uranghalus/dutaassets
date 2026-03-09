"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSafetyEquipment,
  updateSafetyEquipment,
  deleteSafetyEquipment,
} from "@/action/safety-equipment-action";
import { toast } from "sonner";

export function useCreateSafetyEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await createSafetyEquipment(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-equipments"] });
      toast.success("Safety equipment added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add safety equipment");
    },
  });
}

export function useUpdateSafetyEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await updateSafetyEquipment(id, formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-equipments"] });
      toast.success("Safety equipment updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update safety equipment");
    },
  });
}

export function useDeleteSafetyEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteSafetyEquipment(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-equipments"] });
      toast.success("Safety equipment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete safety equipment");
    },
  });
}
