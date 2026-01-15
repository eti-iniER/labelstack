import "@tanstack/react-query";

export const ErrorCode = {
  SERVER_ERROR: "SERVER_ERROR",
  CSV_VALIDATION_ERROR: "CSV_VALIDATION_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
