"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockIssuance } from "@/action/stock-issuance-action";
import { toast } from "sonner";

export function useCreateStockIssuance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await createStockIssuance(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-issuances"] });
      toast.success("Stock issuance recorded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record stock issuance");
    },
  });
}
