"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

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
  assetTransferSchema,
  AssetTransferSchema,
} from "@/schema/asset-transfer-schema";
import { useTransferDialog } from "./transfer-dialog-provider";
import { useCreateAssetTransfer } from "@/hooks/use-asset-transfer";
import { useAssets } from "@/hooks/use-asset";
import { useEmployees } from "@/hooks/use-employee";
import { useAssetLocations } from "@/hooks/use-asset-location";

export function TransferActionDialog() {
  const { open, setOpen } = useTransferDialog();
  const createMutation = useCreateAssetTransfer();

  const { data: assetsData } = useAssets({ page: 0, pageSize: 100 });
  const assets = assetsData?.data || [];

  const { data: employeesData } = useEmployees({ page: 1, pageSize: 100 });
  const employees = employeesData?.data || [];

  const { data: locationsData } = useAssetLocations({ page: 1, pageSize: 100 });
  const locations = locationsData?.data || [];

  const form = useForm<AssetTransferSchema>({
    resolver: zodResolver(assetTransferSchema) as any,
    defaultValues: {
      assetId: "",
      fromLocationId: null,
      toLocationId: null,
      fromEmployeeId: null,
      toEmployeeId: null,
      remarks: "",
    },
  });

  useEffect(() => {
    if (open === "create") {
      form.reset({
        assetId: "",
        fromLocationId: null,
        toLocationId: null,
        fromEmployeeId: null,
        toEmployeeId: null,
        remarks: "",
      });
    }
  }, [open, form]);

  const onSubmit: SubmitHandler<AssetTransferSchema> = async (values) => {
    await createMutation.mutateAsync(values);
    setOpen(null);
  };

  const isLoading = createMutation.isPending;

  return (
    <Dialog open={open === "create"} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Asset Transfer</DialogTitle>
          <DialogDescription>
            Initiate a move for an existing asset.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem
                          key={asset.id_barang}
                          value={asset.id_barang}
                        >
                          {asset.kode_asset} - {asset.nama_asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromLocationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Current Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toLocationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Target Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromEmployeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Employee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Current Holder" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toEmployeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Employee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Target Holder" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
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
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Reason for transfer..."
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
                {isLoading ? "Processing..." : "Create Transfer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
