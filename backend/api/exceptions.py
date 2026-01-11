from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler
from core.exceptions import AppException, ErrorCode


def handler(exc, context):
    request = context.get("request")
    response = exception_handler(exc, context)

    if response is None or request.accepted_renderer.format == "html":
        return None

    if isinstance(exc, AppException):
        return Response(exc.get_full_details(), status=exc.status_code)

    if response is not None:
        return Response(
            {
                "message": response.data.get("detail", "An error occurred."),
                "code": str(
                    getattr(exc, "default_code", ErrorCode.SERVER_ERROR)
                ).upper(),
                "info": response.data,  # Includes raw response data
            },
            status=response.status_code,
        )

    return Response(
        {
            "message": "An unexpected error occurred.",
            "code": ErrorCode.SERVER_ERROR,
            "info": {},
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
