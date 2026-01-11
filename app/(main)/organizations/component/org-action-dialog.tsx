'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateOrganization, useUpdateOrganization } from '@/hooks/use-organization'
import { OrganizationForm, organizationFormSchema } from '@/schema/organization-schema'
import { Organization } from '@/generated/prisma/client'



type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Organization
}

export function OrgActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow

    const createMutation = useCreateOrganization()
    const updateMutation = useUpdateOrganization()

    const form = useForm<OrganizationForm>({
        resolver: zodResolver(organizationFormSchema),
        defaultValues: {
            name: currentRow?.name ?? '',
            slug: currentRow?.slug ?? '',
            isEdit,
        },
    })

    const isPending =
        createMutation.isPending || updateMutation.isPending

    const onSubmit = async (values: OrganizationForm) => {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('slug', values.slug)

        if (isEdit && currentRow) {
            await updateMutation.mutateAsync({
                organizationId: currentRow.id,
                formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        form.reset()
        onOpenChange(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? 'Edit Organization'
                            : 'Add Organization'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update organization name.'
                            : 'Create a new organization.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="organization-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Organization Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Acme Inc."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Slug
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="acme-inc"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button
                        type="submit"
                        form="organization-form"
                        disabled={isPending}
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
