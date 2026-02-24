"use client";

import { useForm, DefaultValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { AssetLoanForm, assetLoanFormSchema } from "@/schema/asset-loan-schema";
import { useLoanDialog } from "./loan-dialog-provider";
import { useCreateAssetLoan } from "@/hooks/use-asset-loan";
import { useAssets } from "@/hooks/use-asset";
import { useEmployees } from "@/hooks/use-employee";
import { useDepartmentsSimple } from "@/hooks/use-departments";

export function LoanActionDialog() {
  const { open, setOpen } = useLoanDialog();
  const createMutation = useCreateAssetLoan();

  // Fetch all assets but we'll filter for AVAILABLE ones in the UI
  const { data: assetsData } = useAssets({ page: 0, pageSize: 100 });

  const { data: employeesData } = useEmployees({ page: 1, pageSize: 100 });
  const employees = employeesData?.data || [];

  const { data: deptsData } = useDepartmentsSimple();
  const departments = deptsData || [];

  const form = useForm<AssetLoanForm>({
    resolver: zodResolver(assetLoanFormSchema) as any,
    defaultValues: {
      departmentId: "",
      assetId: "",
      employeeId: "",
      loanDate: new Date(),
      returnDate: null,
      notes: "",
    } as DefaultValues<AssetLoanForm>,
  });

  const selectedDeptId = form.watch("departmentId");

  const availableAssets =
    assetsData?.data.filter((a: any) => {
      const isAvailable = a.status === "AVAILABLE";
      const matchesDept =
        selectedDeptId && selectedDeptId !== "none"
          ? a.department_id === selectedDeptId
          : true;
      return isAvailable && matchesDept;
    }) || [];

  const filteredEmployees =
    selectedDeptId && selectedDeptId !== "none"
      ? employees.filter((emp: any) => emp.department_id === selectedDeptId)
      : employees;

  useEffect(() => {
    if (open === "loan") {
      form.reset({
        departmentId: "",
        assetId: "",
        employeeId: "",
        loanDate: new Date(),
        returnDate: null,
        notes: "",
      });
    }
  }, [open, form]);

  const onSubmit: SubmitHandler<AssetLoanForm> = async (values) => {
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

    await createMutation.mutateAsync(formData);
    setOpen(null);
  };

  const isLoading = createMutation.isPending;

  return (
    <Dialog open={open === "loan"} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Loan Asset</DialogTitle>
          <DialogDescription>
            Assign an available asset to an employee.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("assetId", "");
                      form.setValue("employeeId", "");
                    }}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem
                          key={dept.id_department}
                          value={dept.id_department}
                        >
                          {dept.nama_department}
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
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an available asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableAssets.map((asset) => (
                        <SelectItem
                          key={asset.id_barang}
                          value={asset.id_barang}
                        >
                          {asset.kode_asset} - {asset.nama_asset}
                        </SelectItem>
                      ))}
                      {availableAssets.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No available assets found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredEmployees.map((emp) => (
                        <SelectItem
                          key={emp.id_karyawan}
                          value={emp.id_karyawan}
                        >
                          {emp.nama} ({emp.nik})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="loanDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Loan Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expected Return</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      placeholder="Optional notes about the loan..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
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
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Create Loan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
