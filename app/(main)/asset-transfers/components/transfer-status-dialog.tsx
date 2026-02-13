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
import { useTransferDialog } from "./transfer-dialog-provider";
import {
  useApproveAssetTransfer,
  useCompleteAssetTransfer,
} from "@/hooks/use-asset-transfer";
import { toast } from "sonner";

export function TransferStatusDialog() {
  const { open, setOpen, currentTransfer } = useTransferDialog();
  const approveMutation = useApproveAssetTransfer();
  const completeMutation = useCompleteAssetTransfer();

  const isOpen = open === "approve" || open === "complete";
  const isApprove = open === "approve";

  const handleConfirm = async () => {
    if (!currentTransfer) return;

    try {
      if (isApprove) {
        await approveMutation.mutateAsync(currentTransfer.id);
        toast.success("Transfer approved successfully");
      } else {
        await completeMutation.mutateAsync(currentTransfer.id);
        toast.success("Transfer completed and asset updated");
      }
      setOpen(null);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isApprove ? "Approve Asset Transfer?" : "Complete Asset Transfer?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isApprove
              ? "This will mark the transfer as approved and ready for fulfillment."
              : "This will finalize the transfer and update the asset's current location/holder in the system."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              isApprove
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {isApprove ? "Approve" : "Complete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
