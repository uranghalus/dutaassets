import {
  createTeam,
  deleteTeam,
  deleteTeamBulk,
  getTeams,
  updateTeam,
} from '@/action/teams-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
======================= */
export function useTeams({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['teams', page, pageSize],
    queryFn: () =>
      getTeams({
        page,
        pageSize,
      }),
  });
}

/* =======================
   CREATE
======================= */
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createTeam(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
    },
  });
}

/* =======================
   UPDATE
======================= */
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      formData,
    }: {
      teamId: string;
      formData: FormData;
    }) => updateTeam(teamId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
    },
  });
}

/* =======================
   DELETE
======================= */
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_team: string) => deleteTeam(id_team),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
    },
  });
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteTeamBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteTeamBulk(ids),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
    },
  });
}
