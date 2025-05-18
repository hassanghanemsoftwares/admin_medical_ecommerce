import { getProductById, getProducts } from "@/lib/services/products-service";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    enabled: !!params,
    retry: 1,
  });
};
export const useProductById = (id: number) => {
  return useQuery({
    queryKey: ["productById", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 0,    
    gcTime: 0,       
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
