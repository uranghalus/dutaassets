"use client";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

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

import { useRemoveTeamMember } from "@/hooks/use-team-members";
import { TeamMember } from "./members-column";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: TeamMember;
}

export function MemberDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const params = useParams();
  const teamId = params.teamId as string;
  const removeMutation = useRemoveTeamMember();

  const onDelete = async () => {
    await removeMutation.mutateAsync({
      teamId,
      userId: currentRow.userId,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-bold">{currentRow.user.name}</span> from this
            team?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            disabled={removeMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {removeMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
