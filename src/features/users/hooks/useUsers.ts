import { getUsers } from "@/lib/services/users-service";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    enabled: !!params, // optional: prevents query from running if params is null
    retry: 1, // optional: retry once on error
    
  });
};
