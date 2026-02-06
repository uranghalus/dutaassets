"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
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

import {
  TeamMemberForm,
  teamMemberFormSchema,
} from "@/schema/team-member-schema";
import {
  useAddTeamMember,
  useOrgMembers,
  useTeamMembers,
} from "@/hooks/use-team-members";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MemberActionDialog({ open, onOpenChange }: Props) {
  const params = useParams();
  const teamId = params.teamId as string;

  const addMutation = useAddTeamMember();

  // Fetch Org Members to select from
  const { data: orgMembers, isLoading: isLoadingOrgMembers } = useOrgMembers();
  // Fetch current team members to exclude them (optional but good UX)
  const { data: currentTeamMembers } = useTeamMembers(teamId);

  // Filter out members already in the team
  // orgMembers structure: { id, userId, user: {...} } roughly depending on return
  // auth.api.listMembers returns { members: [...] } usually
  // But my action returns members array directly.
  // Each member has userId.

  const availableMembers =
    orgMembers?.filter(
      (orgM) =>
        !currentTeamMembers?.some((teamM) => teamM.userId === orgM.userId),
    ) ?? [];

  const form = useForm<TeamMemberForm>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      userId: "",
    },
  });

  const isPending = addMutation.isPending;

  const onSubmit = async (values: TeamMemberForm) => {
    await addMutation.mutateAsync({
      teamId,
      userId: values.userId,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add a user from the organization to this team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="member-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* USER SELECT */}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingOrgMembers ? (
                        <div className="p-2 text-sm text-center">
                          Loading...
                        </div>
                      ) : availableMembers.length === 0 ? (
                        <div className="p-2 text-sm text-center text-muted-foreground">
                          No available users
                        </div>
                      ) : (
                        availableMembers.map((member: any) => (
                          <SelectItem key={member.userId} value={member.userId}>
                            {member.user.name} ({member.user.email})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="member-form" disabled={isPending}>
            {isPending ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
