import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createStockTransfer, getStockTransfers } from "@/action/stock-transfer-action";

export function useStockTransfers(params: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ["stock-transfers", params],
    queryFn: () => getStockTransfers(params),
  });
}

export function useCreateStockTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createStockTransfer(formData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Stock transfer recorded successfully");
        queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
        queryClient.invalidateQueries({ queryKey: ["stocks"] });
      } else {
        toast.error(result.error || "Failed to record stock transfer");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
