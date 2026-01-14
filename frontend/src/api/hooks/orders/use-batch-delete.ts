import { api } from "@/api/client";
import type { SimpleResponse } from "@/api/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const batchDeleteOrders = async (orderIds: number[]) => {
  const response = await api.post<SimpleResponse>("/orders/batch-delete/", {
    orderIds,
  });
  return response.data;
};

export const useBatchDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderIds: number[]) => batchDeleteOrders(orderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
