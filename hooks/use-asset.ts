import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAsset,
  deleteAsset,
  getAssets,
  updateAsset,
} from "@/action/asset-action";
import { toast } from "sonner";

export const useAssets = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["assets", page, pageSize, search],
    queryFn: () => getAssets({ page, pageSize, search }),
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { formData: FormData }) => {
      const result = await createAsset(vars.formData);
      if (result?.error) {
        throw new Error(result.error); // Or handle validation errors
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Asset created successfully");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateAsset(id, formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Asset updated successfully");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAsset(id);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Asset deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
