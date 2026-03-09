"use client";

import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateSafetyEquipment } from "@/hooks/use-safety-equipment-mutation";
import {
  SafetyEquipmentFormValues,
  safetyEquipmentFormSchema,
} from "@/schema/safety-equipment-schema";

// Simple hook to fetch assets not yet linked to safety equipment
import { useQuery } from "@tanstack/react-query";
import { getAssetsForSafetySelect } from "@/action/safety-equipment-action";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EquipmentActionDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateSafetyEquipment();

  const { data: assetsData } = useQuery({
    queryKey: ["assets-for-safety-select"],
    queryFn: async () => {
      const result = await getAssetsForSafetySelect();
      return result.data;
    },
    enabled: open,
  });

  const assets = assetsData || [];

  const form = useForm<SafetyEquipmentFormValues>({
    resolver: zodResolver(safetyEquipmentFormSchema) as any,
    defaultValues: {
      assetId: "",
      type: "APAR",
      aparType: "",
      sizeKg: "" as unknown as number,
      hydrantType: "",
      hydrantSize: "",
    },
  });

  const watchType = form.watch("type");

  useEffect(() => {
    if (open) {
      form.reset({
        assetId: "",
        type: "APAR",
        aparType: "",
        sizeKg: "" as unknown as number,
        hydrantType: "",
        hydrantSize: "",
      });
    }
  }, [open, form]);

  const onSubmit = async (values: SafetyEquipmentFormValues) => {
    const formData = new FormData();
    formData.append("assetId", values.assetId);
    formData.append("type", values.type);
    if (values.aparType) formData.append("aparType", values.aparType);
    if (
      values.sizeKg !== undefined &&
      values.sizeKg !== ("" as unknown as number)
    )
      formData.append("sizeKg", String(values.sizeKg));
    if (values.hydrantType) formData.append("hydrantType", values.hydrantType);
    if (values.hydrantSize) formData.append("hydrantSize", values.hydrantSize);

    await createMutation.mutateAsync(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Safety Equipment</DialogTitle>
          <DialogDescription>
            Register a new APAR or Hydrant equipment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset..." />
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

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="APAR">APAR</SelectItem>
                      <SelectItem value="HYDRANT">Hydrant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchType === "APAR" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="aparType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>APAR Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CO2, Dry Powder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizeKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 6"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {watchType === "HYDRANT" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hydrantType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hydrant Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Pillar, Box" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hydrantSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hydrant Size</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. 2.5"' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save Equipment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
