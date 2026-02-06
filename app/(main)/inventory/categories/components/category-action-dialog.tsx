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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  ItemCategoryForm,
  itemCategoryFormSchema,
} from "@/schema/item-category-schema";
import {
  useCreateItemCategory,
  useUpdateItemCategory,
} from "@/hooks/use-item-category";
import { ItemCategory } from "@/generated/prisma/client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: ItemCategory;
};

export function CategoryActionDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isEdit = !!currentRow;

  const createMutation = useCreateItemCategory();
  const updateMutation = useUpdateItemCategory();

  const form = useForm<ItemCategoryForm>({
    resolver: zodResolver(itemCategoryFormSchema) as Resolver<ItemCategoryForm>,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description ?? "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [currentRow, form, open]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: ItemCategoryForm) => {
    const formData = new FormData();
    formData.append("name", values.name);

    if (values.description) formData.append("description", values.description);

    try {
      if (isEdit && currentRow) {
        await updateMutation.mutateAsync({
          id: currentRow.id,
          formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handled by mutation or global error handler possibly
      console.error(error);
    }
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
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update category details."
              : "Create a new category for items."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="category-form"
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
                    <Input placeholder="Electronics" {...field} />
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
          <Button type="submit" form="category-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
