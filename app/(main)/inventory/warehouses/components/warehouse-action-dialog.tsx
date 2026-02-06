"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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

import { WarehouseForm, warehouseFormSchema } from "@/schema/warehouse-schema";
import { useCreateWarehouse, useUpdateWarehouse } from "@/hooks/use-warehouse";
import { Warehouse } from "@/generated/prisma/client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Warehouse;
};

export function WarehouseActionDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isEdit = !!currentRow;

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();

  const form = useForm<WarehouseForm>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name,
        location: currentRow.location ?? "",
      });
    } else {
      form.reset({
        name: "",
        location: "",
      });
    }
  }, [currentRow, form, open]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: WarehouseForm) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.location) formData.append("location", values.location);

    if (isEdit && currentRow) {
      await updateMutation.mutateAsync({
        id: currentRow.id,
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
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Warehouse" : "Add Warehouse"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update warehouse details."
              : "Create a new warehouse for inventory storage."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="warehouse-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Warehouse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LOCATION */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Building A, Floor 1..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="warehouse-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
