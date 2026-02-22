/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, DefaultValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { useAssetDialog } from "./asset-dialog-provider";
import { useCreateAsset, useUpdateAsset } from "@/hooks/use-asset";
import { useDepartmentsSimple } from "@/hooks/use-departments";
import { useDivisionOptions } from "@/hooks/use-divisions";
import { useEmployees } from "@/hooks/use-employee";
import { useAllAssetCategories } from "@/hooks/use-asset-category";

export function AssetActionDialog() {
  const { open, setOpen, currentAsset } = useAssetDialog();
  const isEdit = open === "edit";

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

  const { data: departments } = useDepartmentsSimple();
  const { data: divisions } = useDivisionOptions(); // Need to verify if this hook exists or create it
  // For employees, we use the paginated hook as a workaround for now, fetching first 100
  const { data: employeesData } = useEmployees({ page: 0, pageSize: 100 });
  const { data: categories } = useAllAssetCategories()
  const employees = employeesData?.data || [];

  const form = useForm<AssetForm>({
    resolver: zodResolver(assetFormSchema) as any,
    defaultValues: {
      kode_asset: "",
      nama_asset: "",
      categoryId: "",
      department_id: "",
      status: "AVAILABLE",
      harga: 0,
      divisi_id: null,
      karyawan_id: null,
      kondisi: "GOOD",
      brand: null,
      model: null,
      serial_number: null,
      lokasi: null,
      deskripsi: null,
      vendor: null,
      tgl_pembelian: null,
      garansi_exp: null,
    } as DefaultValues<AssetForm>,
  });

  useEffect(() => {
    if (open) {
      if (isEdit && currentAsset) {
        form.reset({
          kode_asset: currentAsset.kode_asset,
          nama_asset: currentAsset.nama_asset,

          categoryId: currentAsset.categoryId ?? "",

          department_id: currentAsset.department_id,
          divisi_id: currentAsset.divisi_id,
          karyawan_id: currentAsset.karyawan_id,

          status: currentAsset.status as any,
          kondisi: currentAsset.kondisi as any,

          brand: currentAsset.brand,
          model: currentAsset.model,
          serial_number: currentAsset.serial_number,
          lokasi: currentAsset.lokasi,
          deskripsi: currentAsset.deskripsi,
          vendor: currentAsset.vendor,

          tgl_pembelian: currentAsset.tgl_pembelian
            ? new Date(currentAsset.tgl_pembelian)
            : null,

          garansi_exp: currentAsset.garansi_exp
            ? new Date(currentAsset.garansi_exp)
            : null,

          harga: currentAsset.harga
            ? Number(currentAsset.harga)
            : 0,
        });
      } else {
        form.reset({
          kode_asset: "",
          nama_asset: "",
          categoryId: "",
          department_id: "",
          status: "AVAILABLE",
          harga: 0,
          kondisi: "GOOD",
        });
      }
    }
  }, [open, isEdit, currentAsset, form]);

  const onSubmit: SubmitHandler<AssetForm> = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (isEdit && currentAsset) {
      await updateMutation.mutateAsync({
        id: currentAsset.id_barang,
        formData,
      });
    } else {
      await createMutation.mutateAsync({ formData });
    }
    setOpen(null);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={open === "add" || open === "edit"}
      onOpenChange={() => setOpen(null)}
    >
      <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-2xl">
        {/* ================= HEADER ================= */}
        <DialogHeader className="px-8 pt-8 pb-6 border-b bg-muted/40">
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Edit Asset" : "New Asset"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modify asset details."
              : "Register a new asset into the system."}
          </DialogDescription>
        </DialogHeader>

        {/* ================= BODY ================= */}
        <div className="px-8 py-8 max-h-[72vh] overflow-y-auto">
          <Form {...form}>
            <form
              id="asset-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* ================================================= */}
              {/* BASIC INFORMATION */}
              {/* ================================================= */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* kode_asset */}
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

                  {/* nama_asset */}
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

                  {/* kategori_asset */}
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

                  {/* status */}
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
                            <SelectItem value="MAINTENANCE">
                              Maintenance
                            </SelectItem>
                            <SelectItem value="DISPOSED">Disposed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ================================================= */}
              {/* DETAILS */}
              {/* ================================================= */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Asset Details
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {["brand", "model", "serial_number"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as any}
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

                  {/* kondisi */}
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
                            <SelectItem value="MINOR_DAMAGE">
                              Minor Damage
                            </SelectItem>
                            <SelectItem value="MAJOR_DAMAGE">
                              Major Damage
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ================================================= */}
              {/* LOCATION & ASSIGNMENT */}
              {/* ================================================= */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Location & Assignment
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* department */}
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

                  {/* divisi */}
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
                          defaultValue={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisions?.map((div: any) => (
                              <SelectItem
                                key={div.id_divisi}
                                value={div.id_divisi}
                              >
                                {div.nama_divisi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* employee */}
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
                          defaultValue={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((emp) => (
                              <SelectItem
                                key={emp.id_karyawan}
                                value={emp.id_karyawan}
                              >
                                {emp.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* lokasi */}
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

              {/* ================================================= */}
              {/* PURCHASE */}
              {/* ================================================= */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Purchase Information
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* tgl pembelian */}
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

                  {/* garansi */}
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

                  {/* harga */}
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
            </form>
          </Form>
        </div>

        {/* ================= FOOTER ================= */}
        <DialogFooter className="px-8 py-6 border-t bg-muted/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(null)}
          >
            Cancel
          </Button>
          <Button type="submit" form="asset-form" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEdit
                ? "Update Asset"
                : "Create Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>


  );
}
