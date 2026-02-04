'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'

import { UserForm, userFormSchema } from '@/schema/user-schema'
import { useCreateUser, useUpdateUser } from '@/hooks/use-users'
import { useEmployees } from '@/hooks/use-employee'

// Definition matching the row data
type UserRow = any 

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: UserRow
}

export function UserActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow
    const createMutation = useCreateUser()
    const updateMutation = useUpdateUser()
    
    // Employee Selection State
    const [openEmployee, setOpenEmployee] = useState(false)
    // Fetch employees for linking. Ideally we want UNLINKED employees.
    // For now, fetching page 1, size 100. In real app, implement search.
    const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees({
        page: 1, 
        pageSize: 100
    })
    
    const employees = employeesData?.data ?? []

    const form = useForm<UserForm>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'user',
            password: '',
            employeeId: '',
            isEdit: false,
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                name: currentRow?.name ?? '',
                email: currentRow?.email ?? '',
                role: currentRow?.role ?? 'user',
                password: '', // Don't show password
                employeeId: currentRow?.employee?.id_karyawan ?? '',
                isEdit,
            })
        }
    }, [open, currentRow, isEdit, form])

    const isPending = createMutation.isPending || updateMutation.isPending

    const onSubmit = async (values: UserForm) => {
        const formData = new FormData()
        
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('role', values.role)
        if (values.password) formData.append('password', values.password)
        if (values.employeeId) formData.append('employeeId', values.employeeId)

        if (isEdit && currentRow) {
             await updateMutation.mutateAsync({
                userId: currentRow.id,
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
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit User' : 'Create User'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update user details and permissions.'
                            : 'Add a new user to the system.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="user-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 gap-4"
                    >
                         {/* =========================
                            NAME
                         ========================= */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="John Doe" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         {/* =========================
                            EMAIL
                         ========================= */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="john@example.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* =========================
                            PASSWORD (Optional on Edit)
                         ========================= */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{isEdit ? 'New Password (Optional)' : 'Password'}</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="••••••••" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* =========================
                            ROLE
                         ========================= */}
                         <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            {/* Add more roles if available in system */}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* =========================
                            LINK EMPLOYEE
                         ========================= */}
                         <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Link Employee (Optional)</FormLabel>
                                    <Popover open={openEmployee} onOpenChange={setOpenEmployee}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openEmployee}
                                                className="justify-between"
                                            >
                                                {field.value
                                                    ? employees.find((e) => e.id_karyawan === field.value)?.nama
                                                    : "Select employee..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandInput placeholder="Search employee..." />
                                                <CommandList>
                                                    <CommandEmpty>No employee found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {/* Option to clear selection */}
                                                        <CommandItem
                                                            value="none"
                                                            onSelect={() => {
                                                                field.onChange("")
                                                                setOpenEmployee(false)
                                                            }}
                                                        >
                                                             <span className="text-muted-foreground italic">None (Unlink)</span>
                                                        </CommandItem>
                                                        
                                                        {employees.map((employee) => (
                                                            <CommandItem
                                                                key={employee.id_karyawan}
                                                                value={employee.nama} // Search by name
                                                                onSelect={() => {
                                                                    field.onChange(employee.id_karyawan)
                                                                    setOpenEmployee(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={
                                                                        field.value === employee.id_karyawan
                                                                            ? "mr-2 h-4 w-4 opacity-100"
                                                                            : "mr-2 h-4 w-4 opacity-0"
                                                                    }
                                                                />
                                                                <div className="flex flex-col">
                                                                     <span>{employee.nama}</span>
                                                                     <span className="text-xs text-muted-foreground">{employee.nik}</span>
                                                                </div>
                                                                {/* Indicate if already linked to SOMEONE ELSE? 
                                                                    Ideally backend filters those out or we show a badge.
                                                                    `employee.userId` exists in data.
                                                                */}
                                                                {employee.userId && employee.userId !== currentRow?.id && (
                                                                    <span className="ml-auto text-xs text-red-500">Linked</span>
                                                                )}
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

                    </form>
                </Form>

                <DialogFooter>
                    <Button
                        type="submit"
                        form="user-form"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
