import { createOrganization, deleteOrganization, deleteOrganizationsBulk, getOrganizationDetail, getOrganizations, updateOrganization } from "@/action/organization-action";
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

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organizations'],
            })
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

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organizations'],
            })
        },
    })
}
export function useDeleteOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (organizationId: string) =>
            deleteOrganization(organizationId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organizations'],
            })
        },
    })
}
export function useDeleteOrganizationsBulk() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (organizationIds: string[]) =>
            deleteOrganizationsBulk(organizationIds),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organizations'],
            })
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