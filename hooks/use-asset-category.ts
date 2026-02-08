import {
  createAssetCategory,
  deleteAssetCategory,
  deleteAssetCategoryBulk,
  getAllAssetCategories,
  getAssetCategories,
  getAssetCategory,
  updateAssetCategory,
} from '@/action/asset-category-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
 ======================= */
export function useAssetCategories({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['asset-categories', page, pageSize],
    queryFn: () =>
      getAssetCategories({
        page,
        pageSize,
      }),
  });
}

/* =======================
   GET ALL (FOR SELECT)
 ======================= */
export function useAllAssetCategories() {
  return useQuery({
    queryKey: ['asset-categories-all'],
    queryFn: () => getAllAssetCategories(),
  });
}

/* =======================
   GET SINGLE
 ======================= */
export function useAssetCategory(id: string) {
  return useQuery({
    queryKey: ['asset-category', id],
    queryFn: () => getAssetCategory(id),
    enabled: !!id,
  });
}

/* =======================
   CREATE
 ======================= */
export function useCreateAssetCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createAssetCategory(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['asset-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['asset-categories-all'],
      });
    },
  });
}

/* =======================
   UPDATE
 ======================= */
export function useUpdateAssetCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateAssetCategory(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['asset-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['asset-categories-all'],
      });
    },
  });
}

/* =======================
   DELETE
 ======================= */
export function useDeleteAssetCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAssetCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['asset-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['asset-categories-all'],
      });
    },
  });
}

/* =======================
   BULK DELETE
 ======================= */
export function useDeleteAssetCategoryBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteAssetCategoryBulk(ids),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['asset-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['asset-categories-all'],
      });
    },
  });
}
