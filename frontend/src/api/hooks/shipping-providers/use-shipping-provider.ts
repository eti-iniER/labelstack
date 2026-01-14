import { api } from "@/api/client";
import { type ShippingProvider } from "@/api/types/shipping-provider";
import { useQuery } from "@tanstack/react-query";

const getShippingProvider = async (id: number) => {
  const response = await api.get<ShippingProvider>(
    `/shipping-providers/${id}/`,
  );
  return response.data;
};

export const useShippingProvider = (id: number) => {
  return useQuery({
    queryKey: ["shipping-provider", id],
    queryFn: () => getShippingProvider(id),
    enabled: !!id,
  });
};
