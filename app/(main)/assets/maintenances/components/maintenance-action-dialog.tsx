"use client";

import { useForm, Resolver } from "react-hook-form";
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
import {
  AssetMaintenanceFormValues,
  assetMaintenanceSchema,
} from "@/schema/asset-maintenance-schema";
import {
  useCreateAssetMaintenance,
  useUpdateAssetMaintenance,
} from "@/hooks/use-asset-maintenance";
import { useAssets } from "@/hooks/use-asset";
import { useDialog } from "@/context/dialog-provider";

export function MaintenanceActionDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useDialog<any>();
  const isOpen = open === "add" || open === "edit";
  const isEdit = open === "edit";

  const createMutation = useCreateAssetMaintenance();
  const updateMutation = useUpdateAssetMaintenance();

  // Fetch assets for dropdown
  const { data: assetsData } = useAssets({ page: 0, pageSize: 100 });
  const assets = assetsData?.data || [];

  const form = useForm<AssetMaintenanceFormValues>({
    resolver: zodResolver(
      assetMaintenanceSchema,
    ) as Resolver<AssetMaintenanceFormValues>,
    defaultValues: {
      assetId: "",
      maintenanceDate: new Date(),
      type: "PREVENTIVE",
      provider: "",
      cost: 0,
      description: "",
      status: "SCHEDULED",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && currentRow) {
        form.reset({
          assetId: currentRow.assetId,
          maintenanceDate: new Date(currentRow.maintenanceDate),
          type: currentRow.type,
          provider: currentRow.provider || "",
          cost: Number(currentRow.cost) || 0,
          description: currentRow.description || "",
          status: currentRow.status,
        });
      } else {
        form.reset({
          assetId: "",
          maintenanceDate: new Date(),
          type: "PREVENTIVE",
          provider: "",
          cost: 0,
          description: "",
          status: "SCHEDULED",
        });
      }
    }
  }, [isOpen, isEdit, currentRow, form]);

  const onSubmit = async (values: AssetMaintenanceFormValues) => {
    if (isEdit && currentRow) {
      await updateMutation.mutateAsync({
        id: currentRow.id,
        formData: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    handleClose();
  };

  const handleClose = () => {
    setOpen(null);
    setCurrentRow(null);
    form.reset();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Maintenance" : "New Maintenance"}
          </DialogTitle>
          <DialogDescription>
            Record maintenance or repair details for an asset.
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
                    value={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem
                          key={asset.id_barang}
                          value={asset.id_barang}
                        >
                          [{asset.kode_asset}] {asset.nama_asset}
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
                name="maintenanceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date *</FormLabel>
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

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                        <SelectItem value="REPAIR">Repair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider / Tech *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. IT Support" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Fault</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Details of maintenance..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
