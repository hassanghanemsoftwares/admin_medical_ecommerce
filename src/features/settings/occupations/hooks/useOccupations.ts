
import { getOccupations } from "@/lib/services/occupations-service";
import { useQuery } from "@tanstack/react-query";

export const useOccupations = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["occupation", params],
    queryFn: () => getOccupations(params),
    enabled: !!params,
    retry: 1,
  });
};
