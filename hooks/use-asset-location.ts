import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetLocation,
  deleteAssetLocation,
  getAllAssetLocations,
  getAssetLocations,
  updateAssetLocation,
} from "@/action/asset-location-action";
import { toast } from "sonner";

export const useAssetLocations = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["asset-locations", page, pageSize, search],
    queryFn: () => getAssetLocations({ page, pageSize, search }),
  });
};

export const useCreateAssetLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const result = await createAssetLocation(formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Location created successfully");
      queryClient.invalidateQueries({ queryKey: ["asset-locations"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateAssetLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: any }) => {
      const result = await updateAssetLocation(id, formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["asset-locations"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteAssetLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAssetLocation(id);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Location deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["asset-locations"] });
    },
  });
};

export const useAllAssetLocations = () => {
  return useQuery({
    queryKey: ["asset-locations", "all"],
    queryFn: () => getAllAssetLocations(),
  });
};
