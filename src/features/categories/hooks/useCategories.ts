import { getCategories } from "@/lib/services/categories-service";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    enabled: !!params,
    retry: 1,
  });
};
