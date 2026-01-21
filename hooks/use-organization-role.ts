'use client';

import {
  createOrgRole,
  listOrgRoles,
  updateOrgRole,
} from '@/action/org-role-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   LIST (PAGINATION)
======================= */
export function useOrgRoles({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['org-roles', page, pageSize],
    queryFn: () =>
      listOrgRoles({
        page,
        pageSize,
      }),
  });
}

/* =======================
   CREATE
======================= */
export function useCreateOrgRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      role: string;
      permission: Record<string, string[]>;
    }) => createOrgRole(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['org-roles'],
      });
    },
  });
}

// /* =======================
//    UPDATE
// ======================= */
export function useUpdateOrgRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrgRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['org-roles'],
      });
    },
  });
}

// /* =======================
//    DELETE (SINGLE)
// ======================= */
// export function useDeleteOrgRole() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => deleteOrgRole(id),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ['org-roles'],
//       });
//     },
//   });
// }

// /* =======================
//    BULK DELETE
// ======================= */
// export function useDeleteOrgRolesBulk() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (ids: string[]) => deleteOrgRolesBulk(ids),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ['org-roles'],
//       });
//     },
//   });
// }
