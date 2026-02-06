
import {
  createItemCategory,
  deleteItemCategory,
  deleteItemCategoryBulk,
  getAllItemCategories,
  getItemCategories,
  getItemCategory,
  updateItemCategory,
} from '@/action/item-category-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
======================= */
export function useItemCategories({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['item-categories', page, pageSize],
    queryFn: () =>
      getItemCategories({
        page,
        pageSize,
      }),
  });
}

/* =======================
   GET ALL (FOR SELECT)
======================= */
export function useAllItemCategories() {
  return useQuery({
    queryKey: ['item-categories-all'],
    queryFn: () => getAllItemCategories(),
  });
}

/* =======================
   GET SINGLE
======================= */
export function useItemCategory(id: string) {
  return useQuery({
    queryKey: ['item-category', id],
    queryFn: () => getItemCategory(id),
    enabled: !!id,
  });
}

/* =======================
   CREATE
======================= */
export function useCreateItemCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createItemCategory(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['item-categories-all'],
      });
    },
  });
}

/* =======================
   UPDATE
======================= */
export function useUpdateItemCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateItemCategory(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['item-categories-all'],
      });
    },
  });
}

/* =======================
   DELETE
======================= */
export function useDeleteItemCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItemCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['item-categories-all'],
      });
    },
  });
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteItemCategoryBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteItemCategoryBulk(ids),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item-categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['item-categories-all'],
      });
    },
  });
}
