import {
  createDepartment,
  deleteDepartment,
  deleteDepartmentsBulk,
  getDepartmentOptions,
  getDepartments,
  getDepartmentsSimple,
  updateDepartment,
} from '@/action/dept-action';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
======================= */
export function useDepartments({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['departments', page, pageSize],
    queryFn: () =>
      getDepartments({
        page,
        pageSize,
      }),
    placeholderData: (previousData) => previousData,
  });
}

/* =======================
   CREATE
======================= */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createDepartment(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['departments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['department-options'],
      });
      queryClient.invalidateQueries({
        queryKey: ['departments-simple'],
      });
    },
  });
}

/* =======================
   UPDATE
======================= */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      formData,
    }: {
      departmentId: string;
      formData: FormData;
    }) =>
      updateDepartment({
        departmentId,
        formData,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['departments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['department-options'],
      });
      queryClient.invalidateQueries({
        queryKey: ['departments-simple'],
      });
    },
  });
}

/* =======================
   DELETE
======================= */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => deleteDepartment(departmentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['departments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['department-options'],
      });
      queryClient.invalidateQueries({
        queryKey: ['departments-simple'],
      });
    },
  });
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteDepartmentsBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentIds: string[]) =>
      deleteDepartmentsBulk(departmentIds),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['departments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['department-options'],
      });
      queryClient.invalidateQueries({
        queryKey: ['departments-simple'],
      });
    },
  });
}

/* =======================
   OPTIONS (FORM / FILTER)
======================= */
export function useDepartmentOptions() {
  return useQuery({
    queryKey: ['department-options'],
    queryFn: () => getDepartmentOptions(),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}

/* =======================
   SIMPLE (DROPDOWN)
======================= */
export function useDepartmentsSimple() {
  return useQuery({
    queryKey: ['departments-simple'],
    queryFn: () => getDepartmentsSimple(),
    staleTime: 1000 * 60 * 5,
  });
}
