"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
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
import { Form } from "@/components/ui/form";

import { ItemForm, itemFormSchema } from "@/schema/item-schema";
import { useCreateItem, useUpdateItem } from "@/hooks/use-item";
import { Item } from "@/generated/prisma/client";
import { SupplyAssetFormFields } from "../../../assets/components/supply-asset-form-fields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Item;
};

export function ItemActionDialog({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow;

  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();

  const form = useForm<ItemForm>({
    resolver: zodResolver(itemFormSchema) as Resolver<ItemForm>,
    defaultValues: {
      code: "",
      name: "",
      unit: "PCS",
      categoryId: "",
      category: "",
      minStock: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (currentRow) {
      form.reset({
        code: currentRow.code,
        name: currentRow.name,
        unit: currentRow.unit,
        categoryId: currentRow.categoryId ?? "",
        category: currentRow.category ?? "",
        minStock: currentRow.minStock,
        description: currentRow.description ?? "",
        image: currentRow.image ?? "",
      });
    } else {
      form.reset({
        code: "",
        name: "",
        unit: "PCS",
        categoryId: "",
        category: "",
        minStock: 0,
        description: "",
        image: "",
      });
    }
  }, [currentRow, form, open]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: ItemForm) => {
    const formData = new FormData();
    formData.append("code", values.code);
    formData.append("name", values.name);
    formData.append("unit", values.unit);
    formData.append("minStock", values.minStock.toString());

    if (values.categoryId) formData.append("categoryId", values.categoryId);
    if (values.category) formData.append("category", values.category);
    if (values.description) formData.append("description", values.description);
    if (values.image) formData.append("image", values.image);

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
          <DialogTitle>{isEdit ? "Edit Item" : "Add Item"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update item details."
              : "Register a new item in the master catalog."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="item-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <SupplyAssetFormFields form={form} />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="item-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
