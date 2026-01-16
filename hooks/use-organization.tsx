import { createOrganization, deleteOrganization, deleteOrganizationsBulk, getOrganizationDetail, getOrganizations, getOrganizationsSimple, updateOrganization } from "@/action/organization-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
type UseOrganizationDetailParams = {
    organizationId?: string
    organizationSlug?: string
    membersLimit?: number
}
export function useOrganizations({
    page,
    pageSize,
}: {
    page: number
    pageSize: number
}) {
    return useQuery({
        queryKey: ['organizations', page, pageSize],
        queryFn: () =>
            getOrganizations({
                page,
                pageSize,
            })
    })
}

export function useCreateOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (formData: FormData) =>
            createOrganization(formData),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['organizations'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['organization-options'],
                }),
            ])
        },
    })
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            organizationId,
            formData,
        }: {
            organizationId: string
            formData: FormData
        }) =>
            updateOrganization(organizationId, formData),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['organizations'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['organization-options'],
                }),
            ])
        },
    })
}
export function useDeleteOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (organizationId: string) =>
            deleteOrganization(organizationId),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['organizations'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['organization-options'],
                }),
            ])
        },
    })
}
export function useDeleteOrganizationsBulk() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (organizationIds: string[]) =>
            deleteOrganizationsBulk(organizationIds),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['organizations'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['organization-options'],
                }),
            ])
        },
    })
}
export function useOrganizationDetail({
    organizationId,
    organizationSlug,
    membersLimit = 250,
}: UseOrganizationDetailParams) {
    return useQuery({
        queryKey: [
            'organization',
            organizationId ?? organizationSlug,
            membersLimit,
        ],
        queryFn: () =>
            getOrganizationDetail({
                organizationId: organizationId as string,
                organizationSlug: organizationSlug,
                membersLimit: membersLimit,
            }),
        enabled: Boolean(organizationId || organizationSlug),
    })
}
export function useOrganizationOptions() {
    return useQuery({
        queryKey: ['organization-options'],
        queryFn: () => getOrganizationsSimple(),
        staleTime: 1000 * 60 * 5, // 5 menit
    })
}