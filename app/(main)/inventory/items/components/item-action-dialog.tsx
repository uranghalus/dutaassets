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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { ItemForm, itemFormSchema } from "@/schema/item-schema";
import { useCreateItem, useUpdateItem } from "@/hooks/use-item";
import { useAllItemCategories } from "@/hooks/use-item-category";
import { Item } from "@/generated/prisma/client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Item;
};

export function ItemActionDialog({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow;

  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const { data: categories } = useAllItemCategories();

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
      // image: ""
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
            <div className="grid grid-cols-2 gap-4">
              {/* CODE */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Code</FormLabel>
                    <FormControl>
                      <Input placeholder="ITM-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="A4 Paper" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
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

              {/* UNIT */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="PCS, BOX..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* MIN STOCK */}
            <FormField
              control={form.control}
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stock</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
