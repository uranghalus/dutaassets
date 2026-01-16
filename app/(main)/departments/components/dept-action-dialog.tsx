/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

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

import { Department } from '@/generated/prisma/client'
import {
    useCreateDepartment,
    useUpdateDepartment,
} from '@/hooks/use-departments'

import {
    DepartmentForm,
    departmentFormSchema,
} from '@/schema/dept-schema'

import { authClient } from '@/lib/auth-client'
import { getDepartmentCode } from '@/lib/department-code'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Department
}

export function DepartmentActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow

    const { data: activeOrganization } =
        authClient.useActiveOrganization()

    const createMutation = useCreateDepartment()
    const updateMutation = useUpdateDepartment()

    const form = useForm<DepartmentForm>({
        resolver: zodResolver(departmentFormSchema),
        defaultValues: {
            kode_department: currentRow?.kode_department ?? '',
            nama_department: currentRow?.nama_department ?? '',
            id_hod: currentRow?.id_hod ?? '',
            isEdit,
        },
    })

    const deptName = form.watch('nama_department')

    /* =======================
       AUTO GENERATE CODE
    ======================= */
    useEffect(() => {
        if (!activeOrganization || !deptName) return

        const kode = getDepartmentCode(
            activeOrganization.slug,
            deptName
        )

        form.setValue('kode_department', kode, {
            shouldValidate: true,
        })
    }, [deptName, activeOrganization, form])

    const isPending =
        createMutation.isPending || updateMutation.isPending

    const onSubmit = async (values: DepartmentForm) => {
        const formData = new FormData()

        formData.append('kode_department', values.kode_department)
        formData.append('nama_department', values.nama_department)
        formData.append('id_hod', values.id_hod ?? '')

        if (isEdit && currentRow) {
            await updateMutation.mutateAsync({
                departmentId: currentRow.id_department,
                formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        form.reset()
        onOpenChange(false)
    }

    if (!activeOrganization) return null

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
                        {isEdit ? 'Edit Department' : 'Add Department'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update department data.'
                            : `Create a new department for ${activeOrganization.name}.`}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="department-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* NAMA */}
                        <FormField
                            control={form.control}
                            name="nama_department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Department</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Finance"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* KODE */}
                        <FormField
                            control={form.control}
                            name="kode_department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kode Department</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            readOnly
                                            className="bg-muted"
                                            placeholder="Auto generated"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* HOD */}
                        <FormField
                            control={form.control}
                            name="id_hod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Head of Department</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="user-id (optional)"
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
                        form="department-form"
                        disabled={isPending}
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
