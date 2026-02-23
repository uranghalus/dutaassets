/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, DefaultValues, SubmitHandler } from "react-hook-form";
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
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { AssetForm, assetFormSchema } from "@/schema/asset-schema";
import { useAssetDialog } from "./asset-dialog-provider";
import { useCreateAsset, useUpdateAsset } from "@/hooks/use-asset";
import { FixedAssetFormFields } from "./fixed-asset-form-fields";

export function AssetActionDialog() {
  const { open, setOpen, currentAsset } = useAssetDialog();
  const isEdit = open === "edit";

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

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
          harga: currentAsset.harga ? Number(currentAsset.harga) : 0,
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

        <div className="px-8 py-8 max-h-[72vh] overflow-y-auto">
          <Form {...form}>
            <form
              id="asset-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FixedAssetFormFields form={form} />
            </form>
          </Form>
        </div>

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
