"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TeamForm, teamFormSchema } from "@/schema/team-schema";
import { useCreateTeam, useUpdateTeam } from "@/hooks/use-teams";
import { useDivisis } from "@/hooks/use-divisi";
import { TeamWithRelations } from "./teams-column";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: TeamWithRelations;
};

export function TeamActionDialog({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow;

  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const { data: divisis, isLoading: isLoadingDivisi } = useDivisis();

  const form = useForm<TeamForm>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      nama_team: "",
      kode_team: "",
      divisi_id: "",
      keterangan: "",
    },
  });

  useEffect(() => {
    if (currentRow) {
      form.reset({
        nama_team: currentRow.name,
        kode_team: currentRow.kode_team ?? "",
        divisi_id: currentRow.divisi_id ?? "",
        keterangan: currentRow.keterangan ?? "",
      });
    } else {
      form.reset({
        nama_team: "",
        kode_team: "",
        divisi_id: "",
        keterangan: "",
      });
    }
  }, [currentRow, form, open]); // Reset when opening/changing row

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: TeamForm) => {
    const formData = new FormData();
    formData.append("nama_team", values.nama_team);
    formData.append("kode_team", values.kode_team);
    formData.append("divisi_id", values.divisi_id);
    if (values.keterangan) formData.append("keterangan", values.keterangan);

    if (isEdit && currentRow) {
      await updateMutation.mutateAsync({
        id: currentRow.id,
        formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }

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
          <DialogTitle>{isEdit ? "Edit Team" : "Add Team"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update team details."
              : "Create a new team for this organization."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="team-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="nama_team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* KODE */}
            <FormField
              control={form.control}
              name="kode_team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Code</FormLabel>
                  <FormControl>
                    <Input placeholder="ENG-A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DIVISI */}
            <FormField
              control={form.control}
              name="divisi_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a division" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingDivisi ? (
                        <div className="p-2 text-sm text-center">
                          Loading...
                        </div>
                      ) : (
                        divisis?.map((div: any) => (
                          <SelectItem key={div.id_divisi} value={div.id_divisi}>
                            {div.nama_divisi}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* KETERANGAN */}
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="team-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
