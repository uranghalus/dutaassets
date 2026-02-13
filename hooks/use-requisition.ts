import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRequisition,
  getRequisitions,
  getPaginatedApprovalRequisitions,
  approveRequisition,
  rejectRequisition,
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

export const useApprovalRequisitions = ({
  page,
  pageSize,
  search,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["requisition-approvals", page, pageSize, search, status],
    queryFn: () => getPaginatedApprovalRequisitions({ page, pageSize, search, status }),
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

export const useApproveRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nextStatus }: { id: string; nextStatus: any }) => {
      const result = await approveRequisition(id, nextStatus);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Requisition approved");
      queryClient.invalidateQueries({ queryKey: ["requisition-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useRejectRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await rejectRequisition(id);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Requisition rejected");
      queryClient.invalidateQueries({ queryKey: ["requisition-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
