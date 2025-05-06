import { getWarehouses } from "@/lib/services/warehouse-service";
import { useQuery } from "@tanstack/react-query";

export const useWarehouses = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehouses(params),
    enabled: !!params,
    retry: 1,
  });
};
