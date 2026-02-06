
import {
  createItem,
  deleteItem,
  deleteItemBulk,
  getItems,
  getItem,
  updateItem,
} from '@/action/item-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
======================= */
export function useItems({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['items', page, pageSize],
    queryFn: () =>
      getItems({
        page,
        pageSize,
      }),
  });
}

/* =======================
   GET SINGLE
======================= */
export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(id),
    enabled: !!id,
  });
}

/* =======================
   CREATE
======================= */
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createItem(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
    },
  });
}

/* =======================
   UPDATE
======================= */
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateItem(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
    },
  });
}

/* =======================
   DELETE
======================= */
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItem(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
    },
  });
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteItemBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteItemBulk(ids),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
    },
  });
}
