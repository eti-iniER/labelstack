import { api } from "@/api/client";
import type { Job } from "@/api/types/job";
import { useQuery } from "@tanstack/react-query";

const getJob = async (jobId: number) => {
  const response = await api.get<Job>(`/jobs/${jobId}/`);
  return response.data;
};

export const useJob = (jobId: number | undefined) => {
  return useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => getJob(jobId!),
    enabled: !!jobId,
  });
};
