import { api } from "@/api/client";
import { type Address } from "@/api/types/address";
import { useQuery } from "@tanstack/react-query";

const getAddress = async (id: number) => {
  const response = await api.get<Address>(`/addresses/${id}/`);
  return response.data;
};

export const useAddress = (id: number) => {
  return useQuery({
    queryKey: ["address", id],
    queryFn: () => getAddress(id),
    enabled: !!id,
  });
};
