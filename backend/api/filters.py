import django_filters
from core.models import Order, Package, Address


class OrderFilter(django_filters.FilterSet):
    sender_name = django_filters.CharFilter(
        field_name="sender__first_name", lookup_expr="icontains"
    )
    recipient_name = django_filters.CharFilter(
        field_name="recipient__first_name", lookup_expr="icontains"
    )
    from_address = django_filters.CharFilter(
        field_name="from_address__address", lookup_expr="icontains"
    )
    to_address = django_filters.CharFilter(
        field_name="to_address__address", lookup_expr="icontains"
    )
    job_id = django_filters.CharFilter(field_name="job_id", lookup_expr="exact")

    class Meta:
        model = Order
        fields = [
            "sender_name",
            "recipient_name",
            "from_address",
            "to_address",
            "job_id",
        ]


class PackageFilter(django_filters.FilterSet):
    is_user_created = django_filters.BooleanFilter(field_name="is_user_created")

    class Meta:
        model = Package
        fields = ["is_user_created"]


class AddressFilter(django_filters.FilterSet):
    is_user_created = django_filters.BooleanFilter(field_name="is_user_created")

    class Meta:
        model = Address
        fields = ["is_user_created"]
