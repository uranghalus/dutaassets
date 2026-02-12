import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createStockReceipt, getStockReceipts } from "@/action/stock-receipt-action";

export function useStockReceipts(params: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ["stock-receipts", params],
    queryFn: () => getStockReceipts(params),
  });
}

export function useCreateStockReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createStockReceipt(formData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Stock receipt recorded successfully");
        queryClient.invalidateQueries({ queryKey: ["stock-receipts"] });
        queryClient.invalidateQueries({ queryKey: ["stocks"] });
      } else {
        toast.error(result.error || "Failed to record stock receipt");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
