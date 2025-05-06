
import { getColorSeasons } from "@/lib/services/color-season-service";
import { useQuery } from "@tanstack/react-query";

export const useColorSeasons = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["color_seasons", params],
    queryFn: () => getColorSeasons(params),
    enabled: !!params,
    retry: 1,
  });
};
