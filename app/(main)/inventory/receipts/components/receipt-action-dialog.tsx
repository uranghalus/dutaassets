"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

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

import { useCreateStockReceipt } from "@/hooks/use-stock-receipt";
import { useAllWarehouses } from "@/hooks/use-warehouse";
import { useAllItems } from "@/hooks/use-item";
import {
  StockReceiptForm,
  stockReceiptFormSchema,
} from "@/schema/stock-receipt-schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReceiptActionDialog({ open, onOpenChange }: Props) {
  const { data: warehouses } = useAllWarehouses();
  const { data: items } = useAllItems();

  const allItems = items?.data || [];
  const allWarehouses = warehouses?.data || [];

  const createMutation = useCreateStockReceipt();

  const form = useForm<StockReceiptForm>({
    resolver: zodResolver(stockReceiptFormSchema) as any,
    defaultValues: {
      warehouseId: "",
      vendorName: "",
      referenceNumber: "",
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
        warehouseId: "",
        vendorName: "",
        referenceNumber: "",
        remarks: "",
        items: [{ itemId: "", quantity: 1 }],
      });
    }
  }, [open, form]);

  const onSubmit = async (values: StockReceiptForm) => {
    const formData = new FormData();
    formData.append("warehouseId", values.warehouseId);
    if (values.vendorName) formData.append("vendorName", values.vendorName);
    if (values.referenceNumber)
      formData.append("referenceNumber", values.referenceNumber);
    if (values.remarks) formData.append("remarks", values.remarks);
    formData.append("items", JSON.stringify(values.items));

    await createMutation.mutateAsync(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Stock Receipt</DialogTitle>
          <DialogDescription>
            Record inbound items from external vendors.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receiving Warehouse</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
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

              <FormField
                control={form.control}
                name="vendorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. PT. Duta Distributor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ref / PO Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. PO-2024-001" {...field} />
                    </FormControl>
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
                    <Textarea placeholder="Optional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Items Received</FormLabel>
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
                {createMutation.isPending ? "Recording..." : "Save Receipt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
