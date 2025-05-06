
import { getShelves} from "@/lib/services/shelf-service";
import { useQuery } from "@tanstack/react-query";

export const useShelves = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["shelves", params],
    queryFn: () => getShelves(params),
    enabled: !!params,
    retry: 1,
  });
};
