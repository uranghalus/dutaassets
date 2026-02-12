"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ArrowRight } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useCreateStockTransfer } from "@/hooks/use-stock-transfer";
import { useAllWarehouses } from "@/hooks/use-warehouse";
import { useAllItems } from "@/hooks/use-item";
import {
  StockTransferForm,
  stockTransferFormSchema,
} from "@/schema/stock-transfer-schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TransferActionDialog({ open, onOpenChange }: Props) {
  const { data: warehouses } = useAllWarehouses();
  const { data: items } = useAllItems();

  const allItems = items?.data || [];
  const allWarehouses = warehouses?.data || [];

  const createMutation = useCreateStockTransfer();

  const form = useForm<StockTransferForm>({
    resolver: zodResolver(stockTransferFormSchema) as any,
    defaultValues: {
      fromWarehouseId: "",
      toWarehouseId: "",
      remarks: "",
      items: [{ itemId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        fromWarehouseId: "",
        toWarehouseId: "",
        remarks: "",
        items: [{ itemId: "", quantity: 1 }],
      });
    }
  }, [open, form]);

  const onSubmit = async (values: StockTransferForm) => {
    const formData = new FormData();
    formData.append("fromWarehouseId", values.fromWarehouseId);
    formData.append("toWarehouseId", values.toWarehouseId);
    if (values.remarks) formData.append("remarks", values.remarks);
    formData.append("items", JSON.stringify(values.items));

    await createMutation.mutateAsync(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Stock Transfer</DialogTitle>
          <DialogDescription>
            Move items from one warehouse to another.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --- WAREHOUSES --- */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <FormField
                control={form.control}
                name="fromWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Warehouse</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allWarehouses.map((wh: any) => (
                          <SelectItem key={wh.id} value={wh.id}>
                            {wh.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-6 hidden md:flex">
                <ArrowRight className="text-muted-foreground h-6 w-6" />
              </div>

              <FormField
                control={form.control}
                name="toWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Warehouse</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allWarehouses.map((wh: any) => (
                          <SelectItem key={wh.id} value={wh.id}>
                            {wh.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                      placeholder="Optional notes about this transfer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- ITEMS --- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Items to Transfer</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ itemId: "", quantity: 1 })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    {/* Item Selection */}
                    <div className="col-span-12 md:col-span-7">
                      <FormField
                        control={form.control}
                        name={`items.${index}.itemId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={index !== 0 ? "md:sr-only" : ""}
                            >
                              Item
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Item" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {allItems.map((item: any) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name} ({item.code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-10 md:col-span-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={index !== 0 ? "md:sr-only" : ""}
                            >
                              Quantity
                            </FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Delete */}
                    <div className="col-span-2 md:col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage>
                {form.formState.errors.items?.root?.message}
              </FormMessage>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? "Transferring..."
                  : "Complete Transfer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
