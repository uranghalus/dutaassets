import {
    createDivision,
    deleteDivision,
    deleteDivisionBulk,
    getDivisionOptions,
    getDivisions,
    updateDivisi,
} from '@/action/div-action'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/* =======================
   GET (PAGINATION)
======================= */
export function useDivisions({
    page,
    pageSize,
}: {
    page: number
    pageSize: number
}) {
    return useQuery({
        queryKey: ['divisions', page, pageSize],
        queryFn: () =>
            getDivisions({
                page,
                pageSize,
            }),
    })
}

/* =======================
   CREATE
======================= */
export function useCreateDivision() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (formData: FormData) =>
            createDivision(formData),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['divisions'],
            })
        },
    })
}

/* =======================
   UPDATE
======================= */
export function useUpdateDivision() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            divisiId,
            formData,
        }: {
            divisiId: string
            formData: FormData
        }) =>
            updateDivisi(divisiId, formData),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['divisions'],
            })
        },
    })
}

/* =======================
   DELETE
======================= */
export function useDeleteDivision() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id_divisi: string) =>
            deleteDivision(id_divisi),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['divisions'],
            })
        },
    })
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteDivisionBulk() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            deleteDivisionBulk(ids),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['divisions'],
            })
        },
    })
}
/* =======================
   OPTIONS (DROPDOWN)
======================= */
export function useDivisionOptions(organizationId?: string) {
    return useQuery({
        queryKey: ['division-options', organizationId], // ✅ scoped cache
        queryFn: () => getDivisionOptions(organizationId!), // ✅ param
        enabled: !!organizationId, // ✅ fetch hanya jika ada org
        staleTime: 1000 * 60 * 5, // 5 menit
    })
}