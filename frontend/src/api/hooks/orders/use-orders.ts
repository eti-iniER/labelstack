import { api } from "@/api/client";
import {
  type PaginatedResponse,
  type PaginationParams,
} from "@/api/types/global";
import { type Order, type OrderFilters } from "@/api/types/orders";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UseOrdersParams {
  filters?: OrderFilters;
  pagination?: PaginationParams;
}

const getOrders = async ({
  filters = {},
  pagination = { page: 1, pageSize: 20 },
}: UseOrdersParams = {}) => {
  const response = await api.get<PaginatedResponse<Order>>("/orders/", {
    params: {
      ...filters,
      ...pagination,
    },
  });
  return response.data;
};

export const useOrders = (params: UseOrdersParams = {}) => {
  const { filters = {}, pagination } = params;
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["orders", filters, pagination],
    queryFn: async () => {
      const data = await getOrders(params);
      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
      return data;
    },
  });
};
