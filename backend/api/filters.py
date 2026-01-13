import django_filters
from core.models import Order


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
