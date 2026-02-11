/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

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
import { Textarea } from "@/components/ui/textarea";
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

import { Karyawan, Department } from "@/generated/prisma/client";
import { EmployeeForm, employeeFormSchema } from "@/schema/employee-schema";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/use-employee";
import { useDivisionOptions } from "@/hooks/use-divisions";
import { useDepartmentOptions } from "@/hooks/use-departments";
import { useOrgRoleOptions } from "@/hooks/use-organization-role";
import { EmployeeWithDivisi } from "@/types/employee";
import { formatPhone } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: EmployeeWithDivisi;
};

type DepartmentOption = {
  id_department: string;
  nama_department: string;
  organization_id: string;
};

type DivisionOption = {
  id_divisi: string;
  nama_divisi: string;
  department_id: string;
  department: {
    nama_department: string;
  } | null;
};
// LINK status_karyawan
const EMPLOYEE_STATUSES = ["Aktif", "Kontrak", "Magang", "Nonaktif"];

// LINK jabatan (Moved to dynamic fetching)

export function EmployeeActionDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isEdit = !!currentRow;

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const [openStatus, setOpenStatus] = useState(false);
  const [openJob, setOpenJob] = useState(false);

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      nik: currentRow?.nik ?? "",
      nama: currentRow?.nama ?? "",
      nama_alias: currentRow?.nama_alias ?? "",
      alamat: currentRow?.alamat ?? "",
      no_ktp: currentRow?.no_ktp ?? "",
      telp: currentRow?.telp ?? "",
      divisi_id: currentRow?.divisi_id ?? "",
      department_id: currentRow?.divisi_fk?.department_id ?? "",
      jabatan: currentRow?.jabatan ?? "",
      call_sign: currentRow?.call_sign ?? "",
      status_karyawan: currentRow?.status_karyawan ?? "",
      keterangan: currentRow?.keterangan ?? "",
      tempat_lahir: currentRow?.tempat_lahir ?? "",
      tgl_lahir: currentRow?.tgl_lahir
        ? new Date(currentRow.tgl_lahir)
        : undefined,
      tgl_masuk: currentRow?.tgl_masuk
        ? new Date(currentRow.tgl_masuk)
        : undefined,
      foto: currentRow?.foto ?? "",
      isEdit,
    },
  });

  const [preview, setPreview] = useState<string | null>(
    currentRow?.foto ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: divisions = [], isLoading: isLoadingDivision } =
    useDivisionOptions();
  const { data: departments = [], isLoading: isLoadingDept } =
    useDepartmentOptions();
  const { data: roles = [], isLoading: isLoadingRoles } = useOrgRoleOptions();

  const [openDiv, setOpenDiv] = useState(false);
  const [openDept, setOpenDept] = useState(false);

  const selectedDeptId = form.watch("department_id");

  const filteredDivisions = divisions.filter(
    (div: DivisionOption) => div.department_id === selectedDeptId,
  );

  useEffect(() => {
    if (open) {
      form.reset({
        nik: currentRow?.nik ?? "",
        nama: currentRow?.nama ?? "",
        nama_alias: currentRow?.nama_alias ?? "",
        alamat: currentRow?.alamat ?? "",
        no_ktp: currentRow?.no_ktp ?? "",
        telp: currentRow?.telp ?? "",
        divisi_id: currentRow?.divisi_id ?? "",
        department_id: currentRow?.divisi_fk?.department_id ?? "",
        jabatan: currentRow?.jabatan ?? "",
        call_sign: currentRow?.call_sign ?? "",
        status_karyawan: currentRow?.status_karyawan ?? "",
        keterangan: currentRow?.keterangan ?? "",
        tempat_lahir: currentRow?.tempat_lahir ?? "",
        tgl_lahir: currentRow?.tgl_lahir
          ? new Date(currentRow.tgl_lahir)
          : undefined,
        tgl_masuk: currentRow?.tgl_masuk
          ? new Date(currentRow.tgl_masuk)
          : undefined,
        foto: currentRow?.foto ?? "",
        isEdit,
      });
    }
  }, [open, currentRow, form, isEdit]);

  useEffect(() => {
    if (currentRow?.foto) {
      setPreview(currentRow.foto);
    } else {
      setPreview(null);
    }
  }, [currentRow]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: EmployeeForm) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key !== "isEdit" && value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (isEdit && currentRow) {
      await updateMutation.mutateAsync({
        employeeId: currentRow.id_karyawan,
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
          <DialogTitle>{isEdit ? "Edit Karyawan" : "Add Karyawan"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update employee data." : "Create a new employee."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="employee-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* =========================
                DEPARTMENT
            ========================= */}
            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col">
                  <FormLabel>Department</FormLabel>
                  <Popover open={openDept} onOpenChange={setOpenDept}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDept}
                        className="justify-between"
                        disabled={isLoadingDept}
                      >
                        {field.value
                          ? departments.find(
                              (dept: DepartmentOption) =>
                                dept.id_department === field.value,
                            )?.nama_department
                          : "Select department..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search department..." />
                        <CommandList>
                          <CommandEmpty>No department found.</CommandEmpty>
                          <CommandGroup>
                            {departments.map((dept: DepartmentOption) => (
                              <CommandItem
                                key={dept.id_department}
                                value={dept.nama_department}
                                onSelect={() => {
                                  field.onChange(dept.id_department);
                                  form.setValue("divisi_id", "");
                                  setOpenDept(false);
                                }}
                              >
                                {dept.nama_department}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === dept.id_department
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
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
                DIVISI
            ========================= */}
            <FormField
              control={form.control}
              name="divisi_id"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col">
                  <FormLabel>Divisi</FormLabel>

                  <Popover open={openDiv} onOpenChange={setOpenDiv}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={isLoadingDivision || !selectedDeptId}
                        className="justify-between"
                      >
                        {field.value
                          ? (() => {
                              const div = divisions.find(
                                (d: DivisionOption) =>
                                  d.id_divisi === field.value,
                              );
                              return div
                                ? `${div.nama_divisi} (${
                                    div.department?.nama_department ?? "-"
                                  })`
                                : "Pilih divisi";
                            })()
                          : "Pilih divisi"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search divisi..." />
                        <CommandList>
                          <CommandEmpty>Divisi tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {filteredDivisions.map((div: DivisionOption) => (
                              <CommandItem
                                key={div.id_divisi}
                                value={div.nama_divisi}
                                onSelect={() => {
                                  field.onChange(div.id_divisi);
                                  setOpenDiv(false);
                                }}
                              >
                                {div.nama_divisi}{" "}
                                <span className="text-muted-foreground text-xs">
                                  ({div.department?.nama_department ?? "-"})
                                </span>
                                <Check
                                  className={`ml-auto h-4 w-4 ${
                                    field.value === div.id_divisi
                                      ? "opacity-100"
                                      : "opacity-0"
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
                NIK
            ========================= */}
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

            {/* =========================
                NO KTP
            ========================= */}
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

            {/* =========================
                NAMA
            ========================= */}
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
                NAMA ALIAS
            ========================= */}
            <FormField
              control={form.control}
              name="nama_alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Alias</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(Optional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
                FOTO PROFILE
            ========================= */}
            <FormField
              control={form.control}
              name="foto"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Foto Profile</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {preview && (
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border">
                          <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="grid flex-1 gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, onChange)}
                          {...fieldProps}
                        />
                        <p className="text-muted-foreground text-xs">
                          PNG, JPG or JPEG (Max. 2MB)
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
                ALAMAT
            ========================= */}
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
                TEMPAT & TGL LAHIR
            ========================= */}
            <FormField
              control={form.control}
              name="tempat_lahir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tgl_lahir"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tgl Lahir</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* =========================
    TELEPON
========================= */}
            <FormField
              control={form.control}
              name="telp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Telepon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0812-3456-789"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
    JABATAN (ROLES FROM SERVER)
========================= */}
            <FormField
              control={form.control}
              name="jabatan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Jabatan (Role)</FormLabel>

                  <Popover open={openJob} onOpenChange={setOpenJob}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between"
                        disabled={isLoadingRoles}
                      >
                        {field.value || "Pilih jabatan (Role)"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Cari jabatan/role..." />
                        <CommandList>
                          <CommandEmpty>Jabatan tidak ditemukan.</CommandEmpty>

                          <CommandGroup>
                            {roles.map((item: any) => (
                              <CommandItem
                                key={item.id}
                                value={item.role}
                                onSelect={() => {
                                  field.onChange(item.role);
                                  setOpenJob(false);
                                }}
                              >
                                {item.role}
                                <Check
                                  className={`ml-auto h-4 w-4 ${
                                    field.value === item.role
                                      ? "opacity-100"
                                      : "opacity-0"
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
                TGL MASUK
            ========================= */}
            <FormField
              control={form.control}
              name="tgl_masuk"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Masuk</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
    CALL SIGN
========================= */}
            <FormField
              control={form.control}
              name="call_sign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Sign</FormLabel>
                  <FormControl>
                    <Input placeholder="Radio / ID internal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =========================
    STATUS KARYAWAN
========================= */}
            <FormField
              control={form.control}
              name="status_karyawan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Status Karyawan</FormLabel>

                  <Popover open={openStatus} onOpenChange={setOpenStatus}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between"
                      >
                        {field.value || "Pilih status"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Cari status..." />
                        <CommandList>
                          <CommandEmpty>Status tidak ditemukan.</CommandEmpty>

                          <CommandGroup>
                            {EMPLOYEE_STATUSES.map((status) => (
                              <CommandItem
                                key={status}
                                value={status}
                                onSelect={() => {
                                  field.onChange(status);
                                  setOpenStatus(false);
                                }}
                              >
                                {status}
                                <Check
                                  className={`ml-auto h-4 w-4 ${
                                    field.value === status
                                      ? "opacity-100"
                                      : "opacity-0"
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
    KETERANGAN
========================= */}
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Catatan tambahan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="employee-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
