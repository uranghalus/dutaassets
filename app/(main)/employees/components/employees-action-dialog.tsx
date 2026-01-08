'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'

import { Check, ChevronsUpDown } from 'lucide-react'

import { Karyawan, Divisi } from '@/generated/prisma/client'
import { EmployeeForm, employeeFormSchema } from '@/schema/employee-schema'
import { useCreateEmployee, useUpdateEmployee } from '@/hooks/use-employee'
import { useDivisionOptions } from '@/hooks/use-divisions'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Karyawan
}
type DivisionOption = {
    id_divisi: string
    nama_divisi: string
}
export function EmployeeActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow

    const createMutation = useCreateEmployee()
    const updateMutation = useUpdateEmployee()
    const { data: divisions, isLoading } = useDivisionOptions()

    const [openDiv, setOpenDiv] = useState(false)

    const form = useForm<EmployeeForm>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            nik: currentRow?.nik ?? '',
            nama: currentRow?.nama ?? '',
            nama_alias: currentRow?.nama_alias ?? '',
            alamat: currentRow?.alamat ?? '',
            no_ktp: currentRow?.no_ktp ?? '',
            telp: currentRow?.telp ?? '',
            divisi_id: currentRow?.divisi_id ?? '',
            jabatan: currentRow?.jabatan ?? '',
            call_sign: currentRow?.call_sign ?? '',
            status_karyawan: currentRow?.status_karyawan ?? '',
            keterangan: currentRow?.keterangan ?? '',
            isEdit,
        },
    })

    const isPending =
        createMutation.isPending || updateMutation.isPending

    const onSubmit = async (values: EmployeeForm) => {
        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            if (key !== 'isEdit' && value !== undefined) {
                formData.append(key, value as string)
            }
        })

        if (isEdit && currentRow) {
            await updateMutation.mutateAsync({
                employeeId: currentRow.id_karyawan,
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
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Karyawan' : 'Add Karyawan'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update employee data.'
                            : 'Create a new employee.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="employee-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-2 gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="nik"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NIK</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="no_ktp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No KTP</FormLabel>
                                    <FormControl>
                                        <Input {...field} maxLength={16} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nama"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* DIVISI */}
                        <FormField
                            control={form.control}
                            name="divisi_id"
                            render={({ field }) => (
                                <FormItem className="col-span-2 flex flex-col">
                                    <FormLabel>Divisi</FormLabel>

                                    <Popover open={openDiv} onOpenChange={setOpenDiv}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    disabled={isLoading}
                                                    className="justify-between"
                                                >
                                                    {field.value
                                                        ? divisions?.find(
                                                            (d: DivisionOption) =>
                                                                d.id_divisi === field.value
                                                        )?.nama_divisi
                                                        : 'Select divisi'}

                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>

                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandInput placeholder="Search divisi..." />
                                                <CommandList>
                                                    <CommandEmpty>No divisi found.</CommandEmpty>

                                                    <CommandGroup>
                                                        {divisions?.map((div: DivisionOption) => (
                                                            <CommandItem
                                                                key={div.id_divisi}
                                                                value={div.nama_divisi}   // ⭐ WAJIB
                                                                onSelect={() => {
                                                                    field.onChange(div.id_divisi)
                                                                    setOpenDiv(false)
                                                                }}
                                                            >
                                                                {div.nama_divisi}

                                                                <Check
                                                                    className={`ml-auto h-4 w-4 ${field.value === div.id_divisi
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

                        <FormField
                            control={form.control}
                            name="alamat"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Alamat</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button
                        type="submit"
                        form="employee-form"
                        disabled={isPending}
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
