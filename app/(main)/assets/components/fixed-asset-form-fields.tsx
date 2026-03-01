"use client";

import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { AssetForm, assetFormSchema } from "@/schema/asset-schema";
import { useDepartmentsSimple } from "@/hooks/use-departments";
import { useDivisionOptions } from "@/hooks/use-divisions";
import { useEmployeeOptions } from "@/hooks/use-employee";
import { useAllAssetCategories } from "@/hooks/use-asset-category";
import { useAllAssetLocations } from "@/hooks/use-asset-location";

interface FixedAssetFormFieldsProps {
  form: UseFormReturn<AssetForm>;
}

export function FixedAssetFormFields({ form }: FixedAssetFormFieldsProps) {
  const { data: departments } = useDepartmentsSimple();
  const { data: allDivisions } = useDivisionOptions();
  const { data: allEmployees } = useEmployeeOptions();
  const { data: categories } = useAllAssetCategories();
  const { data: locations } = useAllAssetLocations();

  const selectedDepartmentId = form.watch("department_id");
  const selectedDivisiId = form.watch("divisi_id");

  // Filter divisions based on selected department
  const filteredDivisions = selectedDepartmentId
    ? (allDivisions ?? []).filter(
        (div: any) => div.department_id === selectedDepartmentId,
      )
    : [];

  // Filter employees: by divisi if set, else by department
  const filteredEmployees = (() => {
    const list = allEmployees ?? [];
    if (selectedDivisiId) {
      return list.filter((emp: any) => emp.divisi_id === selectedDivisiId);
    }
    if (selectedDepartmentId) {
      return list.filter(
        (emp: any) => emp.department_id === selectedDepartmentId,
      );
    }
    return [];
  })();

  // Reset divisi_id and karyawan_id when department changes
  useEffect(() => {
    form.setValue("divisi_id", null);
    form.setValue("karyawan_id", null);
  }, [selectedDepartmentId, form]);

  // Reset karyawan_id when divisi changes
  useEffect(() => {
    form.setValue("karyawan_id", null);
  }, [selectedDivisiId, form]);

  return (
    <div className="space-y-8">
      {/* BASIC INFORMATION */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Basic Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="kode_asset"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Asset Code *
                </FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nama_asset"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Asset Name *
                </FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Status
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="IN_USE">In Use</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="UNDER_MAINTENANCE">
                      Under Maintenance
                    </SelectItem>
                    <SelectItem value="LOANED">Loaned</SelectItem>
                    <SelectItem value="DISPOSED">Disposed</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Location
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations?.map((loc: any) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* DETAILS */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Asset Details
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {(["brand", "model", "serial_number"] as const).map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs text-muted-foreground capitalize">
                    {name.replace("_", " ")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="kondisi"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Condition
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="MINOR_DAMAGE">Minor Damage</SelectItem>
                    <SelectItem value="MAJOR_DAMAGE">Major Damage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* LOCATION & ASSIGNMENT */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Location & Assignment
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Department *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments?.map((dept: any) => (
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

          <FormField
            control={form.control}
            name="divisi_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Division
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={!selectedDepartmentId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedDepartmentId
                            ? "Select Division"
                            : "Select a department first"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredDivisions.length === 0 ? (
                      <div className="py-2 px-3 text-sm text-muted-foreground">
                        No divisions in this department
                      </div>
                    ) : (
                      filteredDivisions.map((div: any) => (
                        <SelectItem key={div.id_divisi} value={div.id_divisi}>
                          {div.nama_divisi}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="karyawan_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Assign to Employee
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={!selectedDepartmentId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedDepartmentId
                            ? "Select a department first"
                            : filteredEmployees.length === 0
                              ? "No employees found"
                              : "Select Employee"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredEmployees.length === 0 ? (
                      <div className="py-2 px-3 text-sm text-muted-foreground">
                        {selectedDivisiId
                          ? "No employees in this division"
                          : "No employees in this department"}
                      </div>
                    ) : (
                      filteredEmployees.map((emp: any) => (
                        <SelectItem
                          key={emp.id_karyawan}
                          value={emp.id_karyawan}
                        >
                          {emp.nama}
                          {emp.jabatan ? ` — ${emp.jabatan}` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lokasi"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Location
                </FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* PURCHASE */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Purchase Information
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="tgl_pembelian"
            render={({ field }) => (
              <FormItem className="space-y-2 flex flex-col">
                <FormLabel className="text-xs text-muted-foreground">
                  Purchase Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="garansi_exp"
            render={({ field }) => (
              <FormItem className="space-y-2 flex flex-col">
                <FormLabel className="text-xs text-muted-foreground">
                  Warranty Expiration
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harga"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Price (Rp)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vendor"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs text-muted-foreground">
                Vendor
              </FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs text-muted-foreground">
                Description / Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none min-h-[100px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
