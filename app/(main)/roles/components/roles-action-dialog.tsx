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
            permission: currentRow?.permission ?? '{}',
            isEdit,
        },
    })

    const isPending =
        createMutation.isPending || updateMutation.isPending

    const onSubmit = async (values: OrgRoleForm) => {
        // validasi JSON permission
        let parsedPermission: Record<string, string[]>
        try {
            parsedPermission = JSON.parse(values.permission)
        } catch {
            form.setError('permission', {
                message: 'Permission harus JSON valid',
            })
            return
        }

        if (isEdit && currentRow) {
            await updateMutation.mutateAsync({
                roleId: currentRow.id,
                roleName: values.role,
                permission: parsedPermission,
            })
        } else {
            await createMutation.mutateAsync({
                role: values.role,
                permission: parsedPermission,
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
                            name="permission"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permissions (JSON)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={6}
                                            placeholder={`{\n  "project": ["view", "create"]\n}`}
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
