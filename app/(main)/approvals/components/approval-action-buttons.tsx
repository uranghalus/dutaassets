"use client";

import { useState, useTransition } from "react";
import { processApproval } from "@/action/workflow-action";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ApprovalActionButtons({ requestId }: { requestId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [comments, setComments] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleProcess = () => {
    startTransition(async () => {
      try {
        const result = await processApproval(requestId, actionType, comments);
        if (result.success) {
          toast.success(`Request ${actionType.toLowerCase()}d successfully.`);
          setIsOpen(false);
          setComments("");
        }
      } catch (error: any) {
        toast.error(
          error.message || "An error occurred while processing the request.",
        );
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex w-full gap-2">
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setActionType("REJECT")}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </DialogTrigger>

          <DialogTrigger asChild>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setActionType("APPROVE")}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "APPROVE" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              Provide any optional comments for the audit log before confirming
              this action.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter reason or comments (optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-[100px]"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "APPROVE" ? "default" : "destructive"}
              onClick={handleProcess}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {actionType === "APPROVE" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
