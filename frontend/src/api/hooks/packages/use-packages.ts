import { api } from "@/api/client";
import {
  type PaginatedResponse,
  type PaginationParams,
} from "@/api/types/global";
import { type Package, type PackageFilters } from "@/api/types/package";
import { useQuery } from "@tanstack/react-query";

interface UsePackagesParams {
  filters?: PackageFilters;
  pagination?: PaginationParams;
}

const getPackages = async ({
  filters = {},
  pagination = { page: 1, pageSize: 20 },
}: UsePackagesParams = {}) => {
  const response = await api.get<PaginatedResponse<Package>>("/packages/", {
    params: {
      ...filters,
      ...pagination,
    },
  });
  return response.data;
};

export const usePackages = (
  params: UsePackagesParams = {},
  filters: PackageFilters = {},
) => {
  return useQuery({
    queryKey: ["packages", filters, params],
    queryFn: () => getPackages(params),
  });
};
