import { api } from "@/api/client";
import type { SimpleResponse } from "@/api/types/global";
import { convertLbsOzToOz } from "@/lib/utils";
import type { PackageFormData } from "@/schemas/package";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdatePackageParams {
  packageId: number;
  data: Partial<PackageFormData>;
}

const updatePackage = async ({ packageId, data }: UpdatePackageParams) => {
  const { weightLbs, weightOz, ...rest } = data;
  const payload = {
    ...rest,
    ...(weightLbs !== undefined && weightOz !== undefined
      ? { weight: convertLbsOzToOz(weightLbs, weightOz) }
      : {}),
  };

  const response = await api.patch<SimpleResponse>(
    `/packages/${packageId}/`,
    payload,
  );
  return response.data;
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdatePackageParams) => updatePackage(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
