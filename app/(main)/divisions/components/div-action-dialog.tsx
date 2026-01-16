/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check, ChevronsUpDown } from 'lucide-react'

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'

import { Divisi } from '@/generated/prisma/client'
import { useCreateDivision, useUpdateDivision } from '@/hooks/use-divisions'
import { useDepartmentOptions } from '@/hooks/use-departments'
import { DivisionForm, divisionFormSchema } from '@/schema/div-schema'

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

    const form = useForm<DivisionForm>({
        resolver: zodResolver(divisionFormSchema),
        defaultValues: {
            department_id: '',
            nama_divisi: '',
            ext_tlp: '',
        },
    })

    const { data: departments = [], isLoading } = useDepartmentOptions()

    const [openDept, setOpenDept] = useState(false)
    const mounted = true

    /* =========================
       RESET SAAT OPEN
    ========================= */
    useEffect(() => {
        if (open) {
            form.reset({
                department_id: currentRow?.department_id ?? '',
                nama_divisi: currentRow?.nama_divisi ?? '',
                ext_tlp: currentRow?.ext_tlp ?? '',
                isEdit,
            })
        }
    }, [open, currentRow, isEdit, form])

    const isPending =
        createMutation.isPending || updateMutation.isPending

    /* =========================
       SUBMIT
    ========================= */
    const onSubmit = async (values: DivisionForm) => {
        const formData = new FormData()

        formData.append('department_id', values.department_id)
        formData.append('nama_divisi', values.nama_divisi)
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
                if (!state) form.reset()
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
                        {/* =========================
                DEPARTMENT
            ========================= */}
                        <FormField
                            control={form.control}
                            name="department_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Department</FormLabel>

                                    <Popover
                                        open={openDept}
                                        onOpenChange={setOpenDept}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                disabled={isLoading}
                                                className="justify-between"
                                            >
                                                {mounted && field.value
                                                    ? departments.find(
                                                        (d: any) =>
                                                            d.id_department === field.value
                                                    )?.nama_department
                                                    : 'Select department'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandInput placeholder="Search department..." />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No department found.
                                                    </CommandEmpty>

                                                    <CommandGroup>
                                                        {departments.map((dept: any) => (
                                                            <CommandItem
                                                                key={dept.id_department}
                                                                value={dept.nama_department}
                                                                onSelect={() => {
                                                                    field.onChange(dept.id_department)
                                                                    setOpenDept(false)
                                                                }}
                                                            >
                                                                {dept.nama_department}
                                                                <Check
                                                                    className={`ml-auto h-4 w-4 ${field.value === dept.id_department
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0'
                                                                        }`}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* =========================
                NAMA DIVISI
            ========================= */}
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

                        {/* =========================
                EXT TLP
            ========================= */}
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
