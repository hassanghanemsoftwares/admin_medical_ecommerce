import { getBrands } from "@/lib/services/brands-service";
import { useQuery } from "@tanstack/react-query";

export const useBrands = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["brands", params],
    queryFn: () => getBrands(params),
    enabled: !!params,
    retry: 1,
  });
};
