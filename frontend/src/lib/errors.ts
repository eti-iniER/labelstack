/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorCode } from "@/api/types/errors";
import { errorInformation } from "@/constants/errors";

export class APIError {
  message: string;
  status: number;
  code: ErrorCode;
  info: Record<string, any>;

  constructor(
    status: number,
    message: string,
    code: ErrorCode,
    info: Record<string, any>,
  ) {
    this.message = message;
    this.code = code;
    this.info = info;
    this.status = status;
  }
}

export interface ErrorInformation {
  code: ErrorCode;
  message: string;
  description: string;
  resolution?: string;
}

const genericErrorInfo: ErrorInformation = {
  code: ErrorCode.SERVER_ERROR,
  message: "Something went wrong",
  description: "An unexpected error occurred while processing your request.",
  resolution: "Please try again. If the problem persists, contact support.",
};

export function getErrorInfo(code: ErrorCode): ErrorInformation {
  return errorInformation[code] ?? genericErrorInfo;
}
