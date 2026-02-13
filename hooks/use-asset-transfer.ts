import {
  createAssetTransfer,
  getPaginatedAssetTransfers,
  approveAssetTransfer,
  completeAssetTransfer,
} from "@/action/asset-transfer-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* =======================
   GET (PAGINATION)
======================= */
export function useAssetTransfers({
  page,
  pageSize,
  search,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["asset-transfers", page, pageSize, search, status],
    queryFn: () =>
      getPaginatedAssetTransfers({
        page,
        pageSize,
        search,
        status,
      }),
  });
}

/* =======================
   CREATE
======================= */
export function useCreateAssetTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createAssetTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-transfers"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

/* =======================
   APPROVE
======================= */
export function useApproveAssetTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveAssetTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-transfers"] });
    },
  });
}

/* =======================
   COMPLETE
======================= */
export function useCompleteAssetTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeAssetTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-transfers"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
