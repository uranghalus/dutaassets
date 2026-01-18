import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  deleteEmployeeBulk,
  syncEmployeeUser,
} from '@/action/employees-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
======================= */
export function useEmployees({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['employees', page, pageSize],
    queryFn: () =>
      getEmployees({
        page,
        pageSize,
      }),
  });
}

/* =======================
   CREATE
======================= */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createEmployee(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}

/* =======================
   UPDATE
======================= */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      formData,
    }: {
      employeeId: string;
      formData: FormData;
    }) => updateEmployee(employeeId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}

/* =======================
   DELETE
======================= */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_karyawan: string) => deleteEmployee(id_karyawan),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteEmployeeBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteEmployeeBulk(ids),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}
export function useSyncEmployeeUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => syncEmployeeUser(employeeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}
