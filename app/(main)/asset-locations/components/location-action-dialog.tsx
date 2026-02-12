"use client";

import { useForm, Resolver } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  AssetLocationFormValues,
  assetLocationSchema,
} from "@/schema/asset-location-schema";
import {
  useCreateAssetLocation,
  useUpdateAssetLocation,
} from "@/hooks/use-asset-location";
import { useDialog } from "@/context/dialog-provider";

export function LocationActionDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useDialog<any>();
  const isOpen = open === "add" || open === "edit";
  const isEdit = open === "edit";

  const createMutation = useCreateAssetLocation();
  const updateMutation = useUpdateAssetLocation();

  const form = useForm<AssetLocationFormValues>({
    resolver: zodResolver(
      assetLocationSchema,
    ) as Resolver<AssetLocationFormValues>,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && currentRow) {
        form.reset({
          name: currentRow.name,
          description: currentRow.description || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
        });
      }
    }
  }, [isOpen, isEdit, currentRow, form]);

  const onSubmit = async (values: AssetLocationFormValues) => {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Location" : "New Location"}</DialogTitle>
          <DialogDescription>
            Manage asset storage or usage locations.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Warehouse A, IT Room" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional details about this location..."
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
