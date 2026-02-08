import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRequisition,
  getRequisitions,
  updateRequisitionStatus,
} from "@/action/requisition-action";
import { toast } from "sonner";

export const useRequisitions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: ["requisitions", page, pageSize],
    queryFn: () => getRequisitions({ page, pageSize }),
  });
};

export const useCreateRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createRequisition(formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Requisition created successfully");
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateRequisitionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED" | "COMPLETED";
    }) => {
      const result = await updateRequisitionStatus(id, status);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Requisition status updated");
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
