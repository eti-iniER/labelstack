from rest_framework import serializers
from core.models import Order, OrderParty, Package, Address, ShippingProvider
from core.exceptions import ErrorCode


class BatchOrderActionSerializer(serializers.Serializer):
    order_ids = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(), many=True
    )


class BatchOrderUpdateAddressSerializer(BatchOrderActionSerializer):
    address_id = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all())


class BatchOrderUpdatePackageSerializer(BatchOrderActionSerializer):
    package_id = serializers.PrimaryKeyRelatedField(queryset=Package.objects.all())


class BatchOrderUpdateShippingProviderSerializer(BatchOrderActionSerializer):
    shipping_provider_id = serializers.PrimaryKeyRelatedField(
        queryset=ShippingProvider.objects.all()
    )


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "id",
            "name",
            "address",
            "address_2",
            "city",
            "state",
            "zip_code",
            "country",
        )


class OrderPartySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderParty
        fields = ("id", "first_name", "last_name")


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ("id", "length", "width", "height", "weight", "item_sku")


class ShippingProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingProvider
        fields = ("id", "name", "description", "cost_per_pound")


class OrderSerializer(serializers.ModelSerializer):
    sender = OrderPartySerializer()
    recipient = OrderPartySerializer()
    from_address = AddressSerializer()
    to_address = AddressSerializer()
    package = PackageSerializer()
    shipping_provider = ShippingProviderSerializer()

    class Meta:
        model = Order
        fields = (
            "id",
            "job_id",
            "sender",
            "recipient",
            "from_address",
            "to_address",
            "package",
            "shipping_provider",
            "created_at",
            "phone_number",
            "phone_number_2",
        )


class OrderUpdateSerializer(serializers.ModelSerializer):
    shipping_provider = serializers.PrimaryKeyRelatedField(
        queryset=ShippingProvider.objects.all()
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "shipping_provider",
        )


class SimpleResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    info = serializers.JSONField(required=False, allow_null=True)


class UploadResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    job_id = serializers.UUIDField()


class ErrorResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    code = serializers.ChoiceField(
        choices=ErrorCode,
        required=True,
        allow_null=True,
    )
    info = serializers.JSONField(required=False, allow_null=True)


class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
