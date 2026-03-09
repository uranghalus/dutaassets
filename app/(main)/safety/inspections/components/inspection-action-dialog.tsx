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

import { useCreateSafetyInspection } from "@/hooks/use-safety-inspection-mutation";
import { useSafetyEquipmentsForSelect } from "@/hooks/use-safety-equipment";
import {
  SafetyInspectionFormValues,
  safetyInspectionFormSchema,
} from "@/schema/safety-inspection-schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DEFAULT_CHECKLIST_APAR = [
  { itemName: "Kondisi tabung", status: "", note: "" },
  { itemName: "Tekanan gauge", status: "", note: "" },
  { itemName: "Segel & pin pengaman", status: "", note: "" },
  { itemName: "Label & tanggal kadaluarsa", status: "", note: "" },
  { itemName: "Aksesibilitas & penempatan", status: "", note: "" },
];

export function InspectionActionDialog({ open, onOpenChange }: Props) {
  const { data: equipmentsData } = useSafetyEquipmentsForSelect();
  const allEquipments = equipmentsData?.data || [];

  const createMutation = useCreateSafetyInspection();

  const form = useForm<SafetyInspectionFormValues>({
    resolver: zodResolver(safetyInspectionFormSchema) as any,
    defaultValues: {
      equipmentId: "",
      shift: "PAGI",
      inspectionDate: new Date().toISOString().slice(0, 16),
      notes: "",
      items: DEFAULT_CHECKLIST_APAR,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        equipmentId: "",
        shift: "PAGI",
        inspectionDate: new Date().toISOString().slice(0, 16),
        notes: "",
        items: DEFAULT_CHECKLIST_APAR,
      });
    }
  }, [open, form]);

  const onSubmit = async (values: SafetyInspectionFormValues) => {
    const formData = new FormData();
    formData.append("equipmentId", values.equipmentId);
    formData.append("shift", values.shift);
    formData.append("inspectionDate", values.inspectionDate);
    if (values.notes) formData.append("notes", values.notes);
    formData.append("items", JSON.stringify(values.items));

    await createMutation.mutateAsync(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Safety Inspection</DialogTitle>
          <DialogDescription>
            Record a daily inspection log for APAR or Hydrant equipment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="equipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allEquipments.map((eq: any) => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.asset?.nama_asset} ({eq.type})
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
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PAGI">Pagi</SelectItem>
                        <SelectItem value="SIANG">Siang</SelectItem>
                        <SelectItem value="MALAM">Malam</SelectItem>
                        <SelectItem value="MIDDLE">Middle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inspectionDate"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Inspection Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional notes about this inspection"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Checklist Items</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ itemName: "", status: "", note: "" })}
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
                    <div className="col-span-12 md:col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${index}.itemName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={index !== 0 ? "md:sr-only" : ""}
                            >
                              Item
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Kondisi tabung"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.status`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={index !== 0 ? "md:sr-only" : ""}
                            >
                              Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="OK">OK</SelectItem>
                                <SelectItem value="NOK">NOK</SelectItem>
                                <SelectItem value="PERLU_PERHATIAN">
                                  Perlu Perhatian
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-10 md:col-span-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.note`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={index !== 0 ? "md:sr-only" : ""}
                            >
                              Note
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Optional note" {...field} />
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
                {createMutation.isPending
                  ? "Recording..."
                  : "Record Inspection"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
