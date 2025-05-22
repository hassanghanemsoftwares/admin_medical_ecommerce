
import { getStockAdjustments } from "@/lib/services/stockAdjustmentService";
import { useQuery } from "@tanstack/react-query";

export const useStockAdjustments = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["stockAdjustments", params],
    queryFn: () => getStockAdjustments(params),
    enabled: !!params, // optional: prevents query from running if params is null
    retry: 1, // optional: retry once on error
    
  });
};
