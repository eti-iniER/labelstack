import { api } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import type { AxiosProgressEvent } from "axios";

interface UploadCSVParams {
  file: File;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

const uploadCSV = async ({ file, onUploadProgress }: UploadCSVParams) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/orders/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data;
};

export const useUploadCSV = () => {
  return useMutation({
    mutationFn: uploadCSV,
  });
};
