
import { getColors } from "@/lib/services/color-service";
import { useQuery } from "@tanstack/react-query";

export const useColors = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["colors", params],
    queryFn: () => getColors(params),
    enabled: !!params,
    retry: 1,
  });
};
