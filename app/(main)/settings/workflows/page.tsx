import { getApprovalTemplates } from "@/action/workflow-settings-action";
import { WorkflowBuilder } from "./components/workflow-builder";
import { Separator } from "@/components/ui/separator";
import { getActiveOrganizationWithRole } from "@/action/organization-action";
import { listOrgRoles } from "@/action/org-role-action";

export default async function SettingsWorkflowsPage() {
  const { organizationId } = await getActiveOrganizationWithRole();
  const templates = await getApprovalTemplates();
  const orgRolesResponse = await listOrgRoles({ page: 1, pageSize: 100 });

  // Parse generic response to just the roles
  const roles = orgRolesResponse?.data || [];
  const jabatans = [
    "Manager",
    "Supervisor",
    "General Manager",
    "Director",
    "Staff",
    "Admin",
  ]; // Or pull from dictionary

  return (
    <div className="space-y-6 flex-1 w-full max-w-5xl">
      <div>
        <h3 className="text-lg font-medium">Approval Workflows</h3>
        <p className="text-sm text-muted-foreground">
          Configure multi-step approval paths for Requisitions, Asset Disposals,
          and more.
        </p>
      </div>

      <Separator />

      <WorkflowBuilder
        initialTemplates={templates}
        availableRoles={roles}
        availableJabatans={jabatans}
      />
    </div>
  );
}
