import { api } from "@/api/client";
import {
  type PaginatedResponse,
  type PaginationParams,
} from "@/api/types/global";
import { type Order, type OrderFilters } from "@/api/types/orders";
import { useQuery } from "@tanstack/react-query";

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
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
  });
};
