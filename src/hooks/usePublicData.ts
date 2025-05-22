import { useQuery } from "@tanstack/react-query";
import { getAllProductsVariants, getAllSettings } from "@/lib/services/settings-service";
import { GetAllSettingsResponse, GetProductVariantsResponse } from "@/types/response.interfaces";

export const useSettings = () => {
  return useQuery<GetAllSettingsResponse>({
    queryKey: ["settings", "all"],
    queryFn: getAllSettings,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
export const useAllProductsVariants = () => {
  return useQuery<GetProductVariantsResponse>({
    queryKey: ["getAllProductsVariants"],
    queryFn: getAllProductsVariants,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
