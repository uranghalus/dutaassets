import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStockAdjustment } from "@/action/stock-adjustment-action";
import { toast } from "sonner";

import { getStockAdjustments } from "@/action/stock-adjustment-action";

export const useStockAdjustments = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: ["stock-adjustments", page, pageSize],
    queryFn: () => getStockAdjustments({ page, pageSize }),
  });
};

export const useCreateStockAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createStockAdjustment(formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Stock adjustment created successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] }); // Invalidate items to refresh stock
      queryClient.invalidateQueries({ queryKey: ["stocks"] }); 
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
