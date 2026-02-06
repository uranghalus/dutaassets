
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addTeamMember,
  getOrgMembers,
  getTeamMembers,
  removeTeamMember,
} from '@/action/team-members-action';

/* =======================
   GET MEMBERS
======================= */
export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => getTeamMembers(teamId),
    enabled: !!teamId,
  });
}

/* =======================
   GET ORG MEMBERS
======================= */
export function useOrgMembers() {
    return useQuery({
      queryKey: ['org-members'],
      queryFn: () => getOrgMembers(),
    });
  }

/* =======================
   ADD MEMBER
======================= */
export function useAddTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      addTeamMember(teamId, userId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['team-members', variables.teamId],
      });
    },
  });
}

/* =======================
   REMOVE MEMBER
======================= */
export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      removeTeamMember(teamId, userId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['team-members', variables.teamId],
      });
    },
  });
}
