"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApprovalDialog } from "./approval-dialog-provider";
import {
  useApproveRequisition,
  useRejectRequisition,
} from "@/hooks/use-requisition";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function ApprovalDialog() {
  const { open, setOpen, currentRequisition } = useApprovalDialog();
  const approveMutation = useApproveRequisition();
  const rejectMutation = useRejectRequisition();
  const [remarks, setRemarks] = useState("");

  const isOpen = open === "approve" || open === "reject";
  const isApprove = open === "approve";

  const handleConfirm = async () => {
    if (!currentRequisition) return;

    try {
      if (isApprove) {
        // Simple sequential flow logic
        const statusMap: Record<string, string> = {
          PENDING_SUPERVISOR: "PENDING_FA",
          PENDING_FA: "PENDING_GM",
          PENDING_GM: "PENDING_WAREHOUSE",
        };
        const nextStatus =
          statusMap[currentRequisition.status] || "PENDING_WAREHOUSE";

        await approveMutation.mutateAsync({
          id: currentRequisition.id,
          nextStatus: nextStatus as any,
        });
        toast.success(
          "Requisition approved to " + nextStatus.replace("_", " "),
        );
      } else {
        await rejectMutation.mutateAsync(currentRequisition.id);
        toast.success("Requisition rejected");
      }
      setOpen(null);
      setRemarks("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isApprove ? "Approve Requisition?" : "Reject Requisition?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isApprove
              ? "This will authorize the request and move it to the next approval stage."
              : "This will terminate the requisition process."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <Textarea
            placeholder="Add internal notes or reason (optional)..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="resize-none"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-destructive hover:bg-destructive/90"
            }
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            {approveMutation.isPending || rejectMutation.isPending
              ? "Processing..."
              : isApprove
                ? "Confirm Approval"
                : "Reject"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
