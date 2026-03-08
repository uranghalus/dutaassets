"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createApprovalTemplate,
  deleteApprovalTemplate,
  toggleTemplateStatus,
} from "@/action/workflow-settings-action";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export function WorkflowBuilder({
  initialTemplates,
  availableRoles,
  availableJabatans,
}: {
  initialTemplates: any[];
  availableRoles: any[];
  availableJabatans: string[];
}) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    entityType: "ASSET_DISPOSAL",
  });
  const [steps, setSteps] = useState([{ targetRole: "", targetJabatan: "" }]);

  const handleAddStep = () => {
    setSteps([...steps, { targetRole: "", targetJabatan: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, key: string, value: string) => {
    const newSteps = [...steps];
    (newSteps as any)[index][key] = value;
    setSteps(newSteps);
  };

  const handleSave = () => {
    if (!newTemplate.name) return toast.error("Name is required");
    if (steps.length === 0) return toast.error("At least one step is required");

    startTransition(async () => {
      try {
        const payload = {
          ...newTemplate,
          steps: steps.map((s, i) => ({
            stepNumber: i + 1,
            targetRole: s.targetRole || undefined,
            targetJabatan: s.targetJabatan || undefined,
          })),
        };
        const created = await createApprovalTemplate(payload);
        setTemplates([{ ...created, steps: payload.steps }, ...templates]);
        toast.success("Workflow Template Created");
        setIsDialogOpen(false);
        // Reset form
        setNewTemplate({ name: "", entityType: "ASSET_DISPOSAL" });
        setSteps([{ targetRole: "", targetJabatan: "" }]);
      } catch (err: any) {
        toast.error(err.message || "Failed to save workflow");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteApprovalTemplate(id);
        setTemplates(templates.filter((t) => t.id !== id));
        toast.success("Workflow Template Deleted");
      } catch (err: any) {
        toast.error("Failed to delete the workflow");
      }
    });
  };

  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      try {
        await toggleTemplateStatus(id, active);
        setTemplates(
          templates.map((t) => (t.id === id ? { ...t, isActive: active } : t)),
        );
        toast.success("Status Updated");
      } catch (err) {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end pt-4">
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <Card key={t.id} className="relative">
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{t.name}</CardTitle>
                <CardDescription className="text-xs font-mono mt-1">
                  Triggers on: {t.entityType}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={t.isActive}
                  onCheckedChange={(c) => handleToggle(t.id, c)}
                  disabled={isPending}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={() => handleDelete(t.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 flex flex-col gap-2">
                {t.steps?.map((step: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm bg-background border p-2 rounded-md"
                  >
                    <span className="font-bold flex items-center justify-center bg-primary text-primary-foreground h-5 w-5 rounded-full text-[10px]">
                      {step.stepNumber}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {step.targetJabatan
                        ? `Jabatan: \${step.targetJabatan}`
                        : `Role: \${step.targetRole}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
            No workflows configured yet.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Workflow Template</DialogTitle>
            <DialogDescription>
              Define the series of approvals required for an action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Workflow Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  placeholder="e.g., Standard Asset Disposal"
                />
              </div>
              <div className="space-y-2">
                <Label>Trigger Action</Label>
                <Select
                  value={newTemplate.entityType}
                  onValueChange={(v) =>
                    setNewTemplate({ ...newTemplate, entityType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASSET_DISPOSAL">
                      Asset Disposal
                    </SelectItem>
                    <SelectItem value="REQUISITION">Requisition</SelectItem>
                    <SelectItem value="ASSET_LOAN">Asset Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm font-semibold text-muted-foreground uppercase">
                Approval Steps
              </Label>

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 bg-muted/30 p-3 rounded-lg border"
                >
                  <div className="font-bold text-muted-foreground bg-muted h-9 w-9 flex items-center justify-center rounded-md border">
                    {index + 1}
                  </div>

                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Requirement Type</Label>
                    <Select
                      value={step.targetJabatan ? "jabatan" : "role"}
                      onValueChange={(v) => {
                        // Reset the other when switching
                        if (v === "jabatan") {
                          handleStepChange(index, "targetRole", "");
                        } else {
                          handleStepChange(index, "targetJabatan", "");
                        }
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="role">Specific App Role</SelectItem>
                        <SelectItem value="jabatan">
                          Specific Title (Jabatan)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-[2] space-y-1">
                    <Label className="text-xs">Value</Label>
                    {step.targetJabatan ||
                    (step.targetJabatan === "" && !step.targetRole) ? (
                      <Select
                        value={step.targetJabatan}
                        onValueChange={(v) =>
                          handleStepChange(index, "targetJabatan", v)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select Title..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableJabatans.map((j) => (
                            <SelectItem key={j} value={j}>
                              {j}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select
                        value={step.targetRole}
                        onValueChange={(v) =>
                          handleStepChange(index, "targetRole", v)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select Role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((r) => (
                            <SelectItem key={r.id} value={r.name}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveStep(index)}
                    disabled={steps.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={handleAddStep}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Next Step
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Workflow Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
