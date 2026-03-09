"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSafetyInspection } from "@/action/safety-inspection-action";
import { toast } from "sonner";

export function useCreateSafetyInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await createSafetyInspection(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-inspections"] });
      toast.success("Safety inspection recorded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record safety inspection");
    },
  });
}
