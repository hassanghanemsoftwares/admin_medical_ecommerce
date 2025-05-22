import { getStocks } from "@/lib/services/stockService";
import { useQuery } from "@tanstack/react-query";

export const useStocks = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["stocks", params],
    queryFn: () => getStocks(params),
    enabled: !!params, // optional: prevents query from running if params is null
    retry: 1, // optional: retry once on error
    
  });
};
