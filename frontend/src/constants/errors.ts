import type { ErrorInformation } from "@/lib/errors";
import { ErrorCode } from "@/api/types/errors";

export const errorInformation: Record<ErrorCode, ErrorInformation> = {
  [ErrorCode.SERVER_ERROR]: {
    code: ErrorCode.SERVER_ERROR,
    message: "Server error",
    description:
      "An unexpected error occurred on the server while processing your request.",
    resolution:
      "Please try again later. If the problem persists, contact support.",
  },
  [ErrorCode.CSV_VALIDATION_ERROR]: {
    code: ErrorCode.CSV_VALIDATION_ERROR,
    message: "CSV validation failed",
    description:
      "The uploaded CSV file contains invalid or malformed data that could not be processed.",
    resolution:
      "Check that your CSV file matches the expected template format, ensure all required columns are present, and verify the data in each row is valid.",
  },
};
