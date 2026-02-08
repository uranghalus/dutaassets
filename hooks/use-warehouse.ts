
import {
  createWarehouse,
  deleteWarehouse,
  deleteWarehouseBulk,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
} from '@/action/warehouse-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
======================= */
export function useWarehouses({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['warehouses', page, pageSize],
    queryFn: () =>
      getWarehouses({
        page,
        pageSize,
      }),
  });
}

/* =======================
   GET SINGLE
======================= */
export function useWarehouse(id: string) {
  return useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouse(id),
    enabled: !!id,
  });
}

/* =======================
   CREATE
======================= */
export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createWarehouse(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
  });
}

/* =======================
   UPDATE
======================= */
export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateWarehouse(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
  });
}

/* =======================
   DELETE
======================= */
export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
  });
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteWarehouseBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteWarehouseBulk(ids),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
  });
}

/* =======================
   GET ALL (NO PAGINATION)
======================= */
export function useAllWarehouses() {
  return useQuery({
    queryKey: ['warehouses', 'all'],
    queryFn: () => getWarehouses({ page: 0, pageSize: 1000 }),
  });
}
