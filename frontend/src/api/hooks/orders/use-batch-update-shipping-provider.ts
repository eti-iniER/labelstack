import { api } from "@/api/client";
import type { SimpleResponse } from "@/api/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BatchUpdateShippingProviderParams {
  orderIds: number[];
  shippingProviderId: number;
}

const batchUpdateShippingProvider = async (
  params: BatchUpdateShippingProviderParams,
) => {
  const response = await api.post<SimpleResponse>(
    "/orders/batch-update-shipping-provider/",
    params,
  );
  return response.data;
};

export const useBatchUpdateShippingProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: BatchUpdateShippingProviderParams) =>
      batchUpdateShippingProvider(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
