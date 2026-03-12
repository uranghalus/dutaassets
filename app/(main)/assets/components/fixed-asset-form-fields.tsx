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
import { useAllItemCategories } from "@/hooks/use-item-category";
import { useAllAssetLocations } from "@/hooks/use-asset-location";

interface FixedAssetFormFieldsProps {
  form: UseFormReturn<AssetForm>;
}

export function FixedAssetFormFields({ form }: FixedAssetFormFieldsProps) {
  const { data: departments } = useDepartmentsSimple();
  const { data: allDivisions } = useDivisionOptions();
  const { data: allEmployees } = useEmployeeOptions();
  const { data: categories } = useAllItemCategories();
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
          Informasi Utama Aset
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Nama Aset (Contoh: Laptop, Mobil, AC) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ketik nama aset..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Kategori Aset *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
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
            name="brand"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Merk (Contoh: Lenovo, Toyota) (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Merk aset..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Tipe / Model (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tipe / Model aset..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
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
                  Status Ketersediaan
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">
                      Tesedia (Bisa dipakai/dipinjam)
                    </SelectItem>
                    <SelectItem value="IN_USE">Sedang Dipakai</SelectItem>
                    <SelectItem value="MAINTENANCE">
                      Perlu Diperbaiki
                    </SelectItem>
                    <SelectItem value="UNDER_MAINTENANCE">
                      Sedang Dalam Perbaikan
                    </SelectItem>
                    <SelectItem value="LOANED">Sedang Dipinjam</SelectItem>
                    <SelectItem value="DISPOSED">
                      Sudah Dihapus/Dibuang
                    </SelectItem>
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
          Identifikasi & Lokasi Aset
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Nomor Seri (S/N) Fisik
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Masukkan S/N unik benda ini"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Kode Barcode Internal (Opsional)
                </FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
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
                  Lokasi Tempat Aset Ditaruh
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Lokasi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations?.map((loc) => (
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

          <FormField
            control={form.control}
            name="kondisi"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Kondisi Fisik
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GOOD">Bagus (Mulus)</SelectItem>
                    <SelectItem value="FAIR">
                      Cukup (Lecet Pemakaian)
                    </SelectItem>
                    <SelectItem value="POOR">
                      Jelek (Banyak Kerusakan Fisik)
                    </SelectItem>
                    <SelectItem value="BROKEN">
                      Rusak (Tidak Bisa Dipakai)
                    </SelectItem>
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
          Alokasi Departemen & Karyawan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs text-muted-foreground">
                  Departemen *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Departemen" />
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
                  Divisi (Opsional)
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
                            ? "Pilih Divisi"
                            : "Pilih departemen terlebih dahulu"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredDivisions.length === 0 ? (
                      <div className="py-2 px-3 text-sm text-muted-foreground">
                        Tidak ada divisi di departemen ini
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
                  Alokasikan ke Karyawan (Opsional)
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
                            ? "Pilih departemen terlebih dahulu"
                            : filteredEmployees.length === 0
                              ? "Tidak ada karyawan"
                              : "Pilih Karyawan (Pengguna Aset)"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredEmployees.length === 0 ? (
                      <div className="py-2 px-3 text-sm text-muted-foreground">
                        {selectedDivisiId
                          ? "Karyawan kosong di divisi ini"
                          : "Karyawan kosong di departemen ini"}
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
                  Catatan Lokasi / Meja Detail
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Contoh: Meja sudut, Laci 2"
                  />
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
          Informasi Pembelian & Garansi
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="tgl_pembelian"
            render={({ field }) => (
              <FormItem className="space-y-2 flex flex-col">
                <FormLabel className="text-xs text-muted-foreground">
                  Tanggal Pembelian Aset
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
                          : "Pilih Tanggal"}
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
                  Batas Akhir Garansi
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
                          : "Pilih Tanggal"}
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
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs text-muted-foreground">
                Catatan Tambahan / Deskripsi
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tambahkan info extra mengenai unit ini..."
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
