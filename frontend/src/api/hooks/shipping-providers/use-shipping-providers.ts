import { api } from "@/api/client";
import {
  type PaginatedResponse,
  type PaginationParams,
} from "@/api/types/global";
import { type ShippingProvider } from "@/api/types/shipping-provider";
import { useQuery } from "@tanstack/react-query";

interface UseShippingProvidersParams {
  pagination?: PaginationParams;
}

const getShippingProviders = async ({
  pagination = { page: 1, pageSize: 20 },
}: UseShippingProvidersParams = {}) => {
  const response = await api.get<PaginatedResponse<ShippingProvider>>(
    "/shipping-providers/",
    {
      params: {
        ...pagination,
      },
    },
  );
  return response.data;
};

export const useShippingProviders = (
  params: UseShippingProvidersParams = {},
) => {
  return useQuery({
    queryKey: ["shipping-providers", params],
    queryFn: () => getShippingProviders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
