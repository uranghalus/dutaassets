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
import { Textarea } from '@/components/ui/textarea'

import {
    OrgRoleForm,
    orgRoleFormSchema,
} from '@/schema/org-role-schema'
import { useCreateOrgRole, useUpdateOrgRole } from '@/hooks/use-organization-role'
import { PermissionCheckboxGroup } from '@/components/permission-checkbox-group'


type OrgRoleRow = {
    id: string
    role: string
    permission: string
}

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: OrgRoleRow
}

export function OrgRoleActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow

    const createMutation = useCreateOrgRole()
    const updateMutation = useUpdateOrgRole()

    const form = useForm<OrgRoleForm>({
        resolver: zodResolver(orgRoleFormSchema),
        defaultValues: {
            role: currentRow?.role ?? '',
            permissions: currentRow?.permission
                ? JSON.parse(currentRow.permission)
                : {},
            isEdit,
        },
    });

    const isPending =
        createMutation.isPending || updateMutation.isPending

    const onSubmit = async (values: OrgRoleForm) => {
        if (isEdit && currentRow) {
            await updateMutation.mutateAsync({
                roleId: currentRow.id,
                roleName: values.role,
                permission: values.permissions, // ✅ LANGSUNG
            })
        } else {
            await createMutation.mutateAsync({
                role: values.role,
                permission: values.permissions, // ✅ LANGSUNG
            })
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
                        {isEdit ? 'Edit Role' : 'Add Role'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update organization role and permissions.'
                            : 'Create a new role for this organization.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="org-role-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* ROLE NAME */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="manager"
                                            {...field}
                                            disabled={isEdit} // 🔒 role name biasanya immutable
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* PERMISSION */}
                        <FormField
                            control={form.control}
                            name="permissions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permissions</FormLabel>
                                    <FormControl>
                                        <PermissionCheckboxGroup
                                            value={field.value}
                                            onChange={field.onChange}
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
                        form="org-role-form"
                        disabled={isPending}
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
