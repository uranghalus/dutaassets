"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateRequisitionStatus } from "@/action/requisition-action";
import {
  Requisition,
  Karyawan,
  RequisitionItem,
  Item,
} from "@/generated/prisma/client";
import { useAllWarehouses } from "@/hooks/use-warehouse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type RequisitionWithRelations = Requisition & {
  requester: Karyawan;
  items: (RequisitionItem & { item: Item })[];
  warehouse?: { id: string; name: string } | null; // Using optional relation
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requisition: RequisitionWithRelations | null;
};

// ... imports
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ... existing types

export function RequisitionDetailsDialog({
  open,
  onOpenChange,
  requisition,
}: Props) {
  const queryClient = useQueryClient();
  const { data: warehouses } = useAllWarehouses();
  const allWarehouses = (warehouses?.data || []) as any[];

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");

  // Sync internal state with props when opened
  // Note: we can't easily sync state in functional update pattern without useEffect,
  // but let's just use default value logic or useEffect if strictly needed.
  // Simpler: use key on Dialog to reset or just simple effect.

  // React-query mutation
  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
      warehouseId,
    }: {
      id: string;
      status:
        | "PENDING_FA"
        | "PENDING_GM"
        | "PENDING_WAREHOUSE"
        | "COMPLETED"
        | "REJECTED";
      warehouseId?: string;
    }) => {
      // ... existing mutation logic
      const result = await updateRequisitionStatus(id, status, warehouseId);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    // ... callbacks
    onSuccess: () => {
      toast.success("Requisition status updated");
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!requisition) return null;

  // ... existing badge logic
  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "outline";
    if (status === "COMPLETED") variant = "default";
    if (status.startsWith("PENDING")) variant = "secondary";
    if (status === "REJECTED") variant = "destructive";
    return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
  };

  const steps = [
    {
      id: "PENDING_SUPERVISOR",
      label: "Supervisor Review",
      ackBy: requisition.supervisorAckBy,
      ackAt: requisition.supervisorAckAt,
    },
    {
      id: "PENDING_FA",
      label: "FA Manager Review",
      ackBy: requisition.faManagerAckBy,
      ackAt: requisition.faManagerAckAt,
    },
    {
      id: "PENDING_GM",
      label: "GM Approval",
      ackBy: requisition.gmApprovedBy,
      ackAt: requisition.gmApprovedAt,
    },
    {
      id: "PENDING_WAREHOUSE",
      label: "Warehouse Fulfillment",
      ackBy: null,
      ackAt: null,
    }, // Warehouse just completes it
    { id: "COMPLETED", label: "Completed", ackBy: null, ackAt: null },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === requisition.status);
  const isRejected = requisition.status === "REJECTED";

  const handleNextStep = () => {
    let nextStatus: any = "REJECTED";
    if (requisition.status === "PENDING_SUPERVISOR") nextStatus = "PENDING_FA";
    else if (requisition.status === "PENDING_FA") nextStatus = "PENDING_GM";
    else if (requisition.status === "PENDING_GM")
      nextStatus = "PENDING_WAREHOUSE";
    else if (requisition.status === "PENDING_WAREHOUSE")
      nextStatus = "COMPLETED";

    const warehouseToUse =
      selectedWarehouseId || requisition.warehouseId || undefined;

    mutation.mutate({
      id: requisition.id,
      status: nextStatus,
      warehouseId: warehouseToUse,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <DialogTitle>Requisition Details</DialogTitle>
            {getStatusBadge(requisition.status)}
          </div>
          <DialogDescription>
            Request details and workflow progress.
          </DialogDescription>
        </DialogHeader>

        {/* WORKFLOW STEPPER */}
        <div className="py-4 px-2">
          <div className="flex items-center justify-between text-xs">
            {steps.map((step, index) => {
              const isCompleted =
                index < currentStepIndex || requisition.status === "COMPLETED"; // If completed, all valid
              // REJECTED case: if rejected, maybe all future steps gray?
              // Let's simplified logic:
              // Index < currentStepIndex: Completed (Green)
              // Index === currentStepIndex: Current (Blue / Active)
              // Index > currentStepIndex: Pending (Gray)

              let statusColor = "text-muted-foreground";
              let icon = <Circle className="h-5 w-5" />;

              if (isRejected) {
                if (index === currentStepIndex) {
                  statusColor = "text-destructive";
                  icon = <XCircle className="h-5 w-5" />;
                }
              } else if (requisition.status === "COMPLETED") {
                statusColor = "text-primary";
                icon = <CheckCircle2 className="h-5 w-5" />;
              } else {
                if (index < currentStepIndex) {
                  statusColor = "text-primary";
                  icon = <CheckCircle2 className="h-5 w-5" />;
                } else if (index === currentStepIndex) {
                  statusColor = "text-blue-500 font-medium";
                  icon = <Circle className="h-5 w-5 stroke-[2.5px]" />;
                }
              }

              // Simple Stepper UI
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center gap-1 text-center flex-1",
                    statusColor,
                  )}
                >
                  {icon}
                  <span>{step.label}</span>
                  {step.ackBy && (
                    <span className="text-[10px] text-muted-foreground">
                      {step.ackBy}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
          {/* ... Existing Fields ... */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Requester
            </p>
            <p>{requisition.requester.nama}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p>{format(new Date(requisition.createdAt), "PPP")}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-muted-foreground">
              Source Warehouse
            </p>
            {/* Show selection if allowed to edit warehouse. 
                    - Supervisor/FA/GM usually don't care about warehouse? 
                    - Warehouse Admin care.
                    - Let's allow selection at ANY step for flexibility.
                */}
            {requisition.status !== "COMPLETED" &&
            requisition.status !== "REJECTED" ? (
              <div className="mt-1">
                <Select
                  defaultValue={requisition.warehouseId || undefined}
                  onValueChange={setSelectedWarehouseId}
                >
                  <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Select Source Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {allWarehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {requisition.status === "PENDING_WAREHOUSE" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    *Required for fulfillment
                  </p>
                )}
              </div>
            ) : (
              <p>{requisition.warehouse?.name || "-"}</p>
            )}
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Remarks</p>
            <p>{requisition.remarks || "-"}</p>
          </div>
        </div>

        <div className="border rounded-md mt-4">
          {/* ... Existing Table ... */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisition.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.item.name}</TableCell>
                  <TableCell>{item.item.code}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {!isRejected && requisition.status !== "COMPLETED" && (
            <>
              <Button
                variant="destructive"
                disabled={mutation.isPending}
                onClick={() =>
                  mutation.mutate({ id: requisition.id, status: "REJECTED" })
                }
              >
                Reject
              </Button>

              <Button
                disabled={mutation.isPending}
                onClick={handleNextStep}
                className="min-w-[150px]"
              >
                {requisition.status === "PENDING_SUPERVISOR" &&
                  "Acknowledge (SPV)"}
                {requisition.status === "PENDING_FA" && "Acknowledge (FA)"}
                {requisition.status === "PENDING_GM" && "Approve (GM)"}
                {requisition.status === "PENDING_WAREHOUSE" &&
                  "Fulfill & Complete"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
