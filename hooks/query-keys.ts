/* eslint-disable @typescript-eslint/no-explicit-any */
export const roleKeys = {
  all: ['organization-roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params: any) => [...roleKeys.lists(), params] as const,
};
