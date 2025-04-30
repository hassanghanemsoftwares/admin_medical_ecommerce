


import { getActivityLogs } from "@/lib/services/activity-logs-services";
import { useQuery } from "@tanstack/react-query";

export const useActivityLogs = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
    enabled: !!params, // optional: prevents query from running if params is null
    retry: 1, // optional: retry once on error
    
  });
};
