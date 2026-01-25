import { authClient } from '@/lib/auth-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
export const organizationKeys = {
  all: () => ['organization'] as const,
  list: () => [...organizationKeys.all(), 'list'] as const,
  detail: () => [...organizationKeys.all(), 'detail'] as const,
  invitationDetail: (id: string) =>
    [...organizationKeys.all(), 'invitation', id] as const,
};

export interface OrganizationActiveParams {
  organizationId: string | null;
}

export async function setOrganizationActive(params: OrganizationActiveParams) {
  const { data, error } = await authClient.organization.setActive({
    organizationId: params.organizationId,
  });
  if (error) throw new Error(error.message);

  return data;
}

export const useOrganizationActiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setOrganizationActive,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(),
      });
    },
  });
};
export async function getOrganizationList() {
  const { data, error } = await authClient.organization.list();
  if (error) throw new Error(error.message);

  return data;
}
export type OrganizationListData = Awaited<
  ReturnType<typeof getOrganizationList>
>;

export const useOrganizationListQuery = () => {
  return useQuery({
    queryKey: organizationKeys.list(),
    queryFn: getOrganizationList,
  });
};
