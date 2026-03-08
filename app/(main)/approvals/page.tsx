import { getPendingApprovalsForUser } from "@/action/workflow-action";
import { Main } from "@/components/main";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Activity, CalendarDays } from "lucide-react";
import { ApprovalActionButtons } from "./components/approval-action-buttons";

export default async function ApprovalsPage() {
  const pendingRequests = await getPendingApprovalsForUser();

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "REQUISITION":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ASSET_DISPOSAL":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "ASSET_LOAN":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Main fluid>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Pending Approvals
          </h2>
          <p className="text-muted-foreground">
            Review and process workflow requests routed to you.
          </p>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <FileCheck className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-1 text-foreground">
              All Caught Up!
            </h3>
            <p>
              You have no pending approval requests waiting for your action.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.map((req: any) => (
            <Card key={req.id} className="relative overflow-hidden group">
              <div
                className={`absolute top-0 left-0 w-1 h-full \${getBadgeColor(req.entityType).split(" ")[0]}`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={getBadgeColor(req.entityType)}
                  >
                    {formatType(req.entityType)}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                    Step {req.currentStepNum}
                  </span>
                </div>
                <CardTitle className="text-lg">
                  Request #{req.id.split("-")[0].toUpperCase()}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Activity className="h-3 w-3" />
                  Requested by {req.requester.name || req.requester.email}
                </CardDescription>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <CalendarDays className="h-3 w-3" />
                  {format(new Date(req.createdAt), "PPP p")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-muted/50 rounded-md p-3 mb-4 text-sm break-all font-mono text-muted-foreground">
                  Entity ID: {req.entityId.slice(0, 16)}...
                </div>
                <ApprovalActionButtons requestId={req.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Main>
  );
}
