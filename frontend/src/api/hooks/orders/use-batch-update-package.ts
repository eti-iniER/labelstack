import { api } from "@/api/client";
import type { SimpleResponse } from "@/api/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BatchUpdatePackageParams {
  orderIds: number[];
  packageId: number;
}

const batchUpdatePackage = async (params: BatchUpdatePackageParams) => {
  const response = await api.post<SimpleResponse>(
    "/orders/batch-update-package/",
    params,
  );
  return response.data;
};

export const useBatchUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: BatchUpdatePackageParams) =>
      batchUpdatePackage(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
