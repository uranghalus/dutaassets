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

export function AssetActionDialog() {
  const { open, setOpen, currentAsset } = useAssetDialog();
  const isEdit = open === "edit";

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

  const { data: departments } = useDepartmentsSimple();
  const { data: divisions } = useDivisionOptions(); // Need to verify if this hook exists or create it
  // For employees, we use the paginated hook as a workaround for now, fetching first 100
  const { data: employeesData } = useEmployees({ page: 0, pageSize: 100 });
  const employees = employeesData?.data || [];

  const form = useForm<AssetForm>({
    resolver: zodResolver(assetFormSchema) as any,
    defaultValues: {
      kode_asset: "",
      nama_asset: "",
      kategori_asset: "",
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
          kategori_asset: currentAsset.kategori_asset,
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
          harga: currentAsset.harga ? Number(currentAsset.harga) : 0,
        });
      } else {
        form.reset({
          kode_asset: "",
          nama_asset: "",
          kategori_asset: "",
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Asset" : "New Asset"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modify asset details."
              : "Register a new asset into the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --- BASIC INFO --- */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="kode_asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. LAP-001"
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
                name="nama_asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Macbook Pro M1"
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
                name="kategori_asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Electronics, Furniture"
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
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
                        <SelectItem value="DISPOSED">Disposed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- DETAILS --- */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Apple"
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
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. A2338"
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
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SN123456"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- LOCATION & ASSIGNMENT --- */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
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
                name="lokasi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Room 101, Warehouse A"
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
                name="divisi_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division (Optional)</FormLabel>
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
                          <SelectItem key={div.id_divisi} value={div.id_divisi}>
                            {div.nama_divisi}
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
                name="karyawan_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Employee (Optional)</FormLabel>
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
            </div>

            {/* --- PURCHASE INFO --- */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="tgl_pembelian"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
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
                          selected={field.value || undefined}
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
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor / Supplier</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Tokopedia, Official Store"
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
                name="harga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isEdit
                    ? "Update Asset"
                    : "Create Asset"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
