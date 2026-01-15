import type { ErrorCode } from "@/api/types/errors";
import type { APIError } from "@/lib/errors";

export type ISODateString = string; // e.g. "2023-10-05T14:48:00.000Z"
export type Money = string; // e.g. "19.99"

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SimpleResponse {
  message: string;
  info: Record<string, unknown> | null;
}

export interface ErrorResponse {
  message: string;
  code: ErrorCode;
  info: Record<string, unknown> | null;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationActions {
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: APIError;
  }
}
