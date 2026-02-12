import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getAssetMaintenances, 
  createAssetMaintenance, 
  updateAssetMaintenance, 
  deleteAssetMaintenance 
} from "@/action/asset-maintenance-action";
import { toast } from "sonner";

export const useAssetMaintenances = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["asset-maintenances", params],
    queryFn: () => getAssetMaintenances(params),
  });
};

export const useCreateAssetMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: any) => createAssetMaintenance(formData),
    onSuccess: (res: any) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Maintenance record created");
        queryClient.invalidateQueries({ queryKey: ["asset-maintenances"] });
        queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
    },
    onError: (err: any) => {
        toast.error(err.message || "Something went wrong");
    }
  });
};

export const useUpdateAssetMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: any }) =>
      updateAssetMaintenance(id, formData),
    onSuccess: (res: any) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Maintenance record updated");
        queryClient.invalidateQueries({ queryKey: ["asset-maintenances"] });
        queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
    },
    onError: (err: any) => {
        toast.error(err.message || "Something went wrong");
    }
  });
};

export const useDeleteAssetMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAssetMaintenance(id),
    onSuccess: (res: any) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Maintenance record deleted");
        queryClient.invalidateQueries({ queryKey: ["asset-maintenances"] });
        queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
    },
    onError: (err: any) => {
        toast.error(err.message || "Something went wrong");
    }
  });
};
