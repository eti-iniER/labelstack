import { api } from "@/api/client";
import { type Package } from "@/api/types/package";
import { useQuery } from "@tanstack/react-query";

const getPackage = async (id: number) => {
  const response = await api.get<Package>(`/packages/${id}/`);
  return response.data;
};

export const usePackage = (id: number) => {
  return useQuery({
    queryKey: ["package", id],
    queryFn: () => getPackage(id),
    enabled: !!id,
  });
};
