/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ErrorCode } from "@/api/types/errors";
import { environment } from "@/constants/environment";
import { APIError } from "@/lib/errors";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: environment.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error: AxiosError) => {
    const status = error.response?.status || 500;
    const message =
      (error.response?.data as any)?.message || "An unexpected error occurred";
    const code = (error.response?.data as any)?.code as ErrorCode;
    const info = (error.response?.data as any)?.info;

    const customError = new APIError(status, message, code, info);

    return Promise.reject(customError);
  },
);
