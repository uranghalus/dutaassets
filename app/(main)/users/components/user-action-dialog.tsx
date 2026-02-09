"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { UserForm, userFormSchema } from "@/schema/user-schema";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { useEmployees } from "@/hooks/use-employee";

// Definition matching the row data
type UserRow = any;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: UserRow;
};

export function UserActionDialog({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  // Employee Selection State
  const [openEmployee, setOpenEmployee] = useState(false);
  // Fetch employees for linking.
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees({
    page: 1,
    pageSize: 100,
  });

  const employees = employeesData?.data ?? [];

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      role: "user",
      employeeId: "",
      password: "",
      isEdit: false,
    },
  });

  // Watch values for dynamic display
  const selectedEmployeeId = form.watch("employeeId");
  const usernameValue = form.watch("username");

  const selectedEmployee = employees.find(
    (e) => e.id_karyawan === selectedEmployeeId,
  );

  useEffect(() => {
    if (open) {
      form.reset({
        username: currentRow?.username ?? "",
        role: currentRow?.role ?? "user",
        employeeId: currentRow?.employee?.id_karyawan ?? "",
        password: "",
        isEdit,
      });
    }
  }, [open, currentRow, isEdit, form]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: UserForm) => {
    const formData = new FormData();

    formData.append("username", values.username);
    formData.append("role", values.role);
    if (values.employeeId) formData.append("employeeId", values.employeeId);

    // Only append password if manually provided (override)
    if (values.password) formData.append("password", values.password);

    if (isEdit && currentRow) {
      await updateMutation.mutateAsync({
        userId: currentRow.id,
        formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user details."
              : "Add a new user linked to an employee."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            {/* =========================
                            EMPLOYEE (Central)
                         ========================= */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Employee (Required)</FormLabel>
                  <Popover open={openEmployee} onOpenChange={setOpenEmployee}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openEmployee}
                        className="justify-between"
                      >
                        {field.value
                          ? employees.find((e) => e.id_karyawan === field.value)
                              ?.nama
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
                            {employees.map((employee) => (
                              <CommandItem
                                key={employee.id_karyawan}
                                value={employee.nama}
                                onSelect={() => {
                                  field.onChange(employee.id_karyawan);

                                  // Auto-generate username from name
                                  // Logic: lowercase, spaces -> dots, remove special chars
                                  const generated = employee.nama
                                    .toLowerCase()
                                    .trim()
                                    .replace(/\s+/g, ".")
                                    .replace(/[^a-z0-9.]/g, "");

                                  // Only auto-fill if username is empty or we are in created mode and user hasn't typed a custom one yet
                                  const currentUsername =
                                    form.getValues("username");
                                  if (!currentUsername || !isEdit) {
                                    form.setValue("username", generated);
                                  }

                                  setOpenEmployee(false);
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
                                  <span className="text-xs text-muted-foreground">
                                    {employee.nik}
                                  </span>
                                </div>
                                {employee.userId &&
                                  employee.userId !== currentRow?.id && (
                                    <span className="ml-auto text-xs text-red-500">
                                      Linked
                                    </span>
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

            {selectedEmployee && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p>
                  <strong>Full Name:</strong> {selectedEmployee.nama}
                </p>
                <p>
                  <strong>Initial Password:</strong> {selectedEmployee.no_ktp}
                </p>
              </div>
            )}

            {/* =========================
                            USERNAME
                         ========================= */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe" />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <p className="text-xs text-muted-foreground">
                      Email: {field.value}@dutaverse.com
                    </p>
                  )}
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
                            PASSWORD OVERRIDE (Optional)
                         ========================= */}
            {isEdit && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Leave blank to keep current"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="user-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
