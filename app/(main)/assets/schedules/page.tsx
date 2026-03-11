import { Main } from "@/components/main";
import {
  getActiveMaintenanceSchedules,
  completeMaintenanceSchedule,
  toggleMaintenanceScheduleActive,
} from "@/action/maintenance-schedule-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format, isBefore, startOfDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Trash2 } from "lucide-react";

export const metadata = {
  title: "Asset Maintenance Schedules",
};

export default async function MaintenanceSchedulesPage() {
  const schedules = await getActiveMaintenanceSchedules();

  const today = startOfDay(new Date());

  return (
    <Main fluid>
      <div className="mb-6 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Maintenance Schedules
          </h2>
          <p className="text-muted-foreground">
            Manage and track preventive maintenance tasks for enterprise assets.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Frequency (Days)</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No active maintenance schedules found.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule: any) => {
                const dueDate = new Date(schedule.nextDueDate);
                const isOverdue = isBefore(dueDate, today);

                return (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div className="font-medium">
                        {schedule.asset.item?.name}
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {schedule.asset.item?.code}
                      </div>
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={schedule.taskDescription}
                    >
                      {schedule.taskDescription}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {schedule.maintenanceCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>{schedule.frequencyDays} Days</TableCell>
                    <TableCell
                      className={
                        isOverdue ? "text-destructive font-semibold" : ""
                      }
                    >
                      {format(dueDate, "PPP")}
                    </TableCell>
                    <TableCell>
                      {isOverdue ? (
                        <Badge
                          variant="destructive"
                          className="flex w-fit items-center gap-1"
                        >
                          <Clock className="h-3 w-3" /> Overdue
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50"
                        >
                          Upcoming
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <form
                          action={
                            completeMaintenanceSchedule.bind(
                              null,
                              schedule.id,
                              0,
                              "System",
                              "Completed",
                            ) as any
                          }
                        >
                          <Button
                            title="Mark as Completed"
                            type="submit"
                            size="sm"
                            variant="outline"
                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </form>
                        <form
                          action={
                            toggleMaintenanceScheduleActive.bind(
                              null,
                              schedule.id,
                              false,
                            ) as any
                          }
                        >
                          <Button
                            title="Disable Schedule"
                            type="submit"
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Main>
  );
}
