from enum import StrEnum
from typing import Any, Optional

from rest_framework import status
from rest_framework.exceptions import APIException


class ErrorCode(StrEnum):
    SERVER_ERROR = "SERVER_ERROR"
    CSV_VALIDATION_ERROR = "CSV_VALIDATION_ERROR"


class AppException(APIException):
    detail = "An unexpected error occurred"
    code = ErrorCode.SERVER_ERROR
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    def __init__(
        self,
        detail: Optional[str] = None,
        code: Optional[ErrorCode] = None,
        info: Optional[Any] = None,
        status_code: Optional[int] = None,
    ):
        self.message = detail or getattr(self, "detail", "An unexpected error occurred")
        self.code = code or getattr(self, "code", ErrorCode.SERVER_ERROR)
        self.info = info
        self.status_code = status_code or getattr(
            self, "status_code", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

        super().__init__(detail=self.message, code=self.code)

    def get_full_details(self):
        return {
            "message": self.message,
            "code": self.code,
            "info": self.info,
        }

    def __str__(self):
        return self.message
