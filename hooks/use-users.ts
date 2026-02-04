import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleBanUser,
} from '@/action/users-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =======================
   GET (PAGINATION)
======================= */
export function useUsers({
    page,
    pageSize,
    search,
}: {
    page: number;
    pageSize: number;
    search?: string;
}) {
    return useQuery({
        queryKey: ['users', page, pageSize, search],
        queryFn: () =>
            getUsers({
                page,
                pageSize,
                search,
            }),
    });
}

/* =======================
   CREATE
======================= */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createUser(formData),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
            queryClient.invalidateQueries({
                queryKey: ['employees'], // Invalidate employees too since we link them
            });
        },
    });
}

/* =======================
   UPDATE
======================= */
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            formData,
        }: {
            userId: string;
            formData: FormData;
        }) => updateUser(userId, formData),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
            queryClient.invalidateQueries({
                queryKey: ['employees'],
            });
        },
    });
}

/* =======================
   DELETE
======================= */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
            queryClient.invalidateQueries({
                queryKey: ['employees'],
            });
        },
    });
}

/* =======================
   BAN / UNBAN
======================= */
export function useToggleBanUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            isBanned,
            reason,
        }: {
            userId: string;
            isBanned: boolean;
            reason?: string;
        }) => toggleBanUser(userId, isBanned, reason),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });
}
