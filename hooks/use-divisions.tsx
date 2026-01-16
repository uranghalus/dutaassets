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
        mutationFn: (formData: FormData) => createDivision(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['divisions'] })
            queryClient.invalidateQueries({ queryKey: ['division-options'] })
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
        }) => updateDivisi(divisiId, formData),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['divisions'] })
            queryClient.invalidateQueries({ queryKey: ['division-options'] })
        },
    })
}

/* =======================
   DELETE
======================= */
export function useDeleteDivision() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id_divisi: string) => deleteDivision(id_divisi),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['divisions'] })
            queryClient.invalidateQueries({ queryKey: ['division-options'] })
        },
    })
}

/* =======================
   BULK DELETE
======================= */
export function useDeleteDivisionBulk() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => deleteDivisionBulk(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['divisions'] })
            queryClient.invalidateQueries({ queryKey: ['division-options'] })
        },
    })
}

/* =======================
   OPTIONS (DROPDOWN)
======================= */
export function useDivisionOptions() {
    return useQuery({
        queryKey: ['division-options'],
        queryFn: () => getDivisionOptions(),
        staleTime: 1000 * 60 * 5,
    })
}
