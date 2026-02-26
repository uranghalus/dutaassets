import { useQuery } from "@tanstack/react-query";
import {
  getActivityLogs,
  getAuditLogFilterOptions,
} from "@/action/activity-log-action";

export function useActivityLogs(
  params: {
    page?: number;
    pageSize?: number;
    entityId?: string;
    entityType?: string;
    action?: string;
    model?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {},
) {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
  });
}

export function useAuditLogFilterOptions() {
  return useQuery({
    queryKey: ["audit-log-filter-options"],
    queryFn: () => getAuditLogFilterOptions(),
    staleTime: 1000 * 60 * 5,
  });
}
