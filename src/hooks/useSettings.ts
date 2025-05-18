import { useQuery } from "@tanstack/react-query";
import { getAllSettings } from "@/lib/services/settings-service";
import { GetAllSettingsResponse } from "@/types/response.interfaces";

export const useSettings = () => {
  return useQuery<GetAllSettingsResponse>({
    queryKey: ["settings", "all"],
    queryFn: getAllSettings,
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false, 
    retry: 1,
  });
};
