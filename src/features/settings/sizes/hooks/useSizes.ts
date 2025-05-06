import { getSizes } from "@/lib/services/size-service";
import { useQuery } from "@tanstack/react-query";

export const useSizes = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["sizes", params],
    queryFn: () => getSizes(params),
    enabled: !!params,
    retry: 1,
  });
};
