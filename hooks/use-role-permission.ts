'use client';

import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

type PermissionPayload = {
  [resource: string]: string[];
};

export function useHasPermission(permissions: PermissionPayload) {
  return useQuery({
    queryKey: ['has-permission', permissions],
    queryFn: async () => {
      const { data, error } = await authClient.admin.hasPermission({
        permissions,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    staleTime: 1000 * 30, // 30 detik
    retry: false,
  });
}
