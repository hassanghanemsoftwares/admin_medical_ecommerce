
import { getConfigurations} from "@/lib/services/configuration-service";
import { useQuery } from "@tanstack/react-query";

export const useConfigurations = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["configurations", params],
    queryFn: () => getConfigurations(params),
    enabled: !!params,
    retry: 1,
  });
};
