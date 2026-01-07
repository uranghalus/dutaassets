import {
  createDepartment,
  deleteDepartment,
  deleteDepartmentsBulk,
  getDepartments,
  getDepartmentsSimple,
  updateDepartment,
} from '@/action/dept-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    }) => updateDepartment({ departmentId: departmentId, formData: formData }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['departments'],
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
    },
  });
}
export function useDeleteDepartmentsBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentIds: string[]) =>
      deleteDepartmentsBulk(departmentIds),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['departments'],
      });
    },
  });
}
export function useDepartmentOptions() {
  return useQuery({
    queryKey: ['department-options'],
    queryFn: async () => {
      const res = await getDepartments({
        page: 1,
        pageSize: 1000, // ambil semua (aman untuk dropdown)
      });
      return res.data;
    },
  });
}

export function useDepartmentsSimple() {
  return useQuery({
    queryKey: ['departments-simple'],
    queryFn: () => getDepartmentsSimple(),
  });
}
