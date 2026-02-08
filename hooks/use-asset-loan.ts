import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetLoan,
  deleteAssetLoan,
  getAssetLoans,
  returnAssetLoan,
} from "@/action/asset-loan-action";
import { toast } from "sonner";

export const useAssetLoans = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["asset-loans", page, pageSize, search],
    queryFn: () => getAssetLoans({ page, pageSize, search }),
  });
};

export const useCreateAssetLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createAssetLoan(formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Asset loan created successfully");
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useReturnAssetLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const result = await returnAssetLoan(id, notes);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Asset returned successfully");
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteAssetLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAssetLoan(id);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Asset loan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
