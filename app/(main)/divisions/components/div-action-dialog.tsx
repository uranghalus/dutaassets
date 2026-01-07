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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import { Department, Divisi } from '@/generated/prisma/client'


import { useCreateDivision, useUpdateDivision } from '@/hooks/use-divisions'
import { DivisionForm, divisionFormSchema } from '@/schema/div-schema'
import { useDepartmentOptions } from '@/hooks/use-departments'


type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Divisi
}

export function DivisionActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow

    const createMutation = useCreateDivision()
    const updateMutation = useUpdateDivision()
    const { data: departments, isLoading } = useDepartmentOptions()

    const form = useForm<DivisionForm>({
        resolver: zodResolver(divisionFormSchema),
        defaultValues: {
            nama_divisi: currentRow?.nama_divisi || '',
            department_id: currentRow?.department_id || '',
            ext_tlp: currentRow?.ext_tlp || '',
            isEdit,
        },
    })

    const isPending =
        createMutation.isPending || updateMutation.isPending

    const onSubmit = async (values: DivisionForm) => {
        const formData = new FormData()
        formData.append('nama_divisi', values.nama_divisi)
        formData.append('department_id', values.department_id)
        formData.append('ext_tlp', values.ext_tlp ?? '')

        if (isEdit && currentRow) {
            await updateMutation.mutateAsync({
                divisiId: currentRow.id_divisi,
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
                        {isEdit ? 'Edit Divisi' : 'Add Divisi'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update divisi data.'
                            : 'Create a new divisi.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="division-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Nama Divisi */}
                        <FormField
                            control={form.control}
                            name="nama_divisi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Divisi</FormLabel>
                                    <FormControl>
                                        <Input placeholder="IT Support" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Department Dropdown */}
                        <FormField
                            control={form.control}
                            name="department_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments?.map((dept: Department) => (
                                                <SelectItem
                                                    key={dept.id_department}
                                                    value={dept.id_department}
                                                >
                                                    {dept.nama_department}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ext Tlp */}
                        <FormField
                            control={form.control}
                            name="ext_tlp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ext. Telp</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="1234"
                                            {...field}
                                            value={field.value ?? ''}
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
                        form="division-form"
                        disabled={isPending}
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
