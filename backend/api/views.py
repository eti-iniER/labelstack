from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema_view, extend_schema
from core.models import Order, OrderParty, Address, Package, ShippingProvider
from api.serializers import (
    OrderSerializer,
    OrderUpdateSerializer,
    AddressSerializer,
    ShippingProviderSerializer,
    PackageSerializer,
    OrderPartySerializer,
    BatchOrderActionSerializer,
    BatchOrderUpdateAddressSerializer,
    BatchOrderUpdatePackageSerializer,
    BatchOrderUpdateShippingProviderSerializer,
    SimpleResponseSerializer,
    ErrorResponseSerializer,
    CSVUploadSerializer,
)
from core.services.csv_service import CSVService
from core.exceptions import AppException, ErrorCode


class AddressViewSet(ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class PackageViewSet(ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer


class OrderPartyViewSet(GenericViewSet, RetrieveModelMixin, UpdateModelMixin):
    queryset = OrderParty.objects.all()
    serializer_class = OrderPartySerializer


class ShippingProviderViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = ShippingProvider.objects.all()
    serializer_class = ShippingProviderSerializer


@extend_schema_view(
    batch_delete=extend_schema(
        summary="Batch delete orders",
        description="Delete multiple orders by providing a list of order IDs.",
        request=BatchOrderActionSerializer,
        responses={
            status.HTTP_200_OK: SimpleResponseSerializer,
            status.HTTP_500_INTERNAL_SERVER_ERROR: ErrorResponseSerializer,
        },
    ),
    batch_update_address=extend_schema(
        summary="Batch update order addresses",
        description="Update the to_address for multiple orders by providing a list of order IDs and an address ID.",
        request=BatchOrderUpdateAddressSerializer,
        responses={
            status.HTTP_200_OK: SimpleResponseSerializer,
            status.HTTP_500_INTERNAL_SERVER_ERROR: ErrorResponseSerializer,
        },
    ),
    batch_update_package=extend_schema(
        summary="Batch update order packages",
        description="Update the package for multiple orders by providing a list of order IDs and a package ID.",
        request=BatchOrderUpdatePackageSerializer,
        responses={
            status.HTTP_200_OK: SimpleResponseSerializer,
            status.HTTP_500_INTERNAL_SERVER_ERROR: ErrorResponseSerializer,
        },
    ),
    batch_update_shipping_provider=extend_schema(
        summary="Batch update order shipping providers",
        description="Update the shipping provider for multiple orders by providing a list of order IDs and a shipping provider ID.",
        request=BatchOrderUpdateShippingProviderSerializer,
        responses={
            status.HTTP_200_OK: SimpleResponseSerializer,
            status.HTTP_500_INTERNAL_SERVER_ERROR: ErrorResponseSerializer,
        },
    ),
    upload=extend_schema(
        summary="Upload orders from CSV",
        description="Upload a CSV file to create multiple orders. The file will be validated before processing.",
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "file": {
                        "type": "string",
                        "format": "binary",
                    }
                },
                "required": ["file"],
            }
        },
        responses={
            status.HTTP_201_CREATED: SimpleResponseSerializer,
            status.HTTP_400_BAD_REQUEST: ErrorResponseSerializer,
        },
    ),
)
class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    search_fields = [
        "recipient__first_name",
        "recipient__last_name",
        "from_address__name",
        "from_address__address",
        "from_address_2__name",
        "from_address_2__address",
        "to_address__name",
        "to_address__address",
        "to_address_2__name",
        "to_address_2__address",
    ]

    def get_serializer_class(self):
        if self.action == "batch_update_address":
            return BatchOrderUpdateAddressSerializer
        if self.action in ["update", "partial_update"]:
            return OrderUpdateSerializer
        elif self.action == "batch_update_package":
            return BatchOrderUpdatePackageSerializer
        elif self.action == "batch_update_shipping_provider":
            return BatchOrderUpdateShippingProviderSerializer
        elif self.action == "batch_delete":
            return BatchOrderActionSerializer
        elif self.action == "upload":
            return CSVUploadSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=["post"], url_path="batch-delete")
    def batch_delete(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_ids = serializer.validated_data["order_ids"]

        orders_to_delete = self.get_queryset().filter(
            id__in=[order.id for order in order_ids]
        )
        deleted_count = orders_to_delete.count()

        orders_to_delete.delete()

        return Response({"message": f"Successfully deleted {deleted_count} order(s)."})

    @action(detail=False, methods=["post"], url_path="batch-update-address")
    def batch_update_address(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_ids = serializer.validated_data["order_ids"]
        address = serializer.validated_data["address_id"]

        updated_count = (
            self.get_queryset()
            .filter(id__in=[order.id for order in order_ids])
            .update_from_address(address)
        )

        return Response(
            {"message": f"Successfully updated address for {updated_count} order(s)."}
        )

    @action(detail=False, methods=["post"], url_path="batch-update-package")
    def batch_update_package(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_ids = serializer.validated_data["order_ids"]
        package = serializer.validated_data["package_id"]

        updated_count = (
            self.get_queryset()
            .filter(id__in=[order.id for order in order_ids])
            .update_package(package)
        )

        return Response(
            {"message": f"Successfully updated package for {updated_count} order(s)."}
        )

    @action(detail=False, methods=["post"], url_path="batch-update-shipping-provider")
    def batch_update_shipping_provider(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_ids = serializer.validated_data["order_ids"]
        shipping_provider = serializer.validated_data["shipping_provider_id"]

        updated_count = (
            self.get_queryset()
            .filter(id__in=[order.id for order in order_ids])
            .update_shipping_provider(shipping_provider)
        )

        return Response(
            {
                "message": f"Successfully updated shipping provider for {updated_count} order(s)."
            }
        )

    @action(detail=False, methods=["post"], url_path="upload")
    def upload(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        csv_file = serializer.validated_data["file"]
        csv_service = CSVService(csv_file)

        if not csv_service.is_valid:
            raise AppException(
                detail="Failed to process CSV file",
                code=ErrorCode.CSV_VALIDATION_ERROR,
                info={"errors": csv_service.errors},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        orders = csv_service.create_orders()

        return Response(
            {
                "message": f"Successfully created {len(orders)} order(s)",
                "info": {"order_count": len(orders)},
            },
            status=status.HTTP_201_CREATED,
        )
