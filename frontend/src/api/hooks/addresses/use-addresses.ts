import { api } from "@/api/client";
import {
  type PaginatedResponse,
  type PaginationParams,
} from "@/api/types/global";
import { type Address, type AddressFilters } from "@/api/types/address";
import { useQuery } from "@tanstack/react-query";

interface UseAddressesParams {
  filters?: AddressFilters;
  pagination?: PaginationParams;
}

const getAddresses = async ({
  filters = {},
  pagination = { page: 1, pageSize: 20 },
}: UseAddressesParams = {}) => {
  const response = await api.get<PaginatedResponse<Address>>("/addresses/", {
    params: {
      ...filters,
      ...pagination,
    },
  });
  return response.data;
};

export const useAddresses = (
  params: UseAddressesParams = {},
  filters: AddressFilters = {},
) => {
  return useQuery({
    queryKey: ["addresses", filters, params],
    queryFn: () => getAddresses(params),
  });
};
