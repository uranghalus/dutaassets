"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAssetDialog } from "./asset-dialog-provider";
import { createDisposalRequest } from "@/action/disposal-action";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const disposalSchema = z.object({
  disposalMethod: z.string().min(1, "Method is required"),
  disposalDate: z.string().min(1, "Date is required"),
  disposalValue: z.coerce.number().default(0),
  reason: z.string().default(""),
});

export function AssetDisposeDialog() {
  const { open, setOpen, currentAsset } = useAssetDialog();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof disposalSchema>>({
    resolver: zodResolver(disposalSchema) as any,
    defaultValues: {
      disposalMethod: "SOLD",
      disposalDate: format(new Date(), "yyyy-MM-dd"),
      disposalValue: 0,
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof disposalSchema>) => {
    if (!currentAsset) return;

    setIsSubmitting(true);
    try {
      await createDisposalRequest({
        assetId: currentAsset.id_barang,
        disposalMethod: values.disposalMethod,
        disposalDate: new Date(values.disposalDate),
        disposalValue: values.disposalValue,
        reason: values.reason,
      });

      toast.success("Asset disposal request submitted! Pending approval.");
      setOpen(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to retire asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentAsset) return null;

  return (
    <Dialog
      open={open === "dispose"}
      onOpenChange={(val) => !val && setOpen(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retire / Dispose Asset</DialogTitle>
          <DialogDescription>
            Submit a retirement request for{" "}
            <span className="font-semibold">{currentAsset.nama_asset}</span>.
            This action requires admin approval.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="disposalMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disposal Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SOLD">Sold</SelectItem>
                      <SelectItem value="SCRAPPED">
                        Scrapped / Destroyed
                      </SelectItem>
                      <SelectItem value="DONATED">Donated</SelectItem>
                      <SelectItem value="RECYCLED">Recycled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disposalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disposal Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disposalValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disposal Return Value (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount if sold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Disposal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Broken beyond repair, End of lifecycle"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
