import { api } from "@/api/client";
import type { SimpleResponse } from "@/api/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateOrderParams {
  orderId: number;
  shippingProviderId: number;
}

const updateOrder = async ({
  orderId,
  shippingProviderId,
}: UpdateOrderParams) => {
  const response = await api.patch<SimpleResponse>(`/orders/${orderId}/`, {
    shippingProvider: shippingProviderId,
  });
  return response.data;
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateOrderParams) => updateOrder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
