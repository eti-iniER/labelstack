import { api } from "@/api/client";
import type { SimpleResponse } from "@/api/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BatchUpdateAddressParams {
  orderIds: number[];
  addressId: number;
}

const batchUpdateAddress = async (params: BatchUpdateAddressParams) => {
  const response = await api.post<SimpleResponse>(
    "/orders/batch-update-address/",
    params,
  );
  return response.data;
};

export const useBatchUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: BatchUpdateAddressParams) =>
      batchUpdateAddress(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
