import { api } from "@/api/client";
import type { SimpleResponse } from "@/api/types/global";
import type { AddressFormData } from "@/schemas/address";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateAddressParams {
  addressId: number;
  data: Partial<AddressFormData>;
}

const updateAddress = async ({ addressId, data }: UpdateAddressParams) => {
  const response = await api.patch<SimpleResponse>(
    `/addresses/${addressId}/`,
    data,
  );
  return response.data;
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateAddressParams) => updateAddress(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
