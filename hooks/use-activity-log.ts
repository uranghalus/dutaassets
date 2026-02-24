import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/action/activity-log-action";

export function useActivityLogs(params: { 
  page?: number; 
  pageSize?: number;
  entityId?: string;
  entityType?: string;
} = {}) {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
  });
}
