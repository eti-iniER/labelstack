from decimal import Decimal

from django.db.models import F, Sum

from core.models import Job


OUNCES_PER_POUND = Decimal("16")


class JobService:
    def __init__(self, job: Job):
        self.job = job

    def get_total_cost(self) -> Decimal:
        result = (
            self.job.orders.filter(shipping_provider__isnull=False)
            .annotate(
                order_cost=(F("package__weight") / OUNCES_PER_POUND)
                * F("shipping_provider__cost_per_pound")
            )
            .aggregate(total=Sum("order_cost"))
        )
        return result["total"] or Decimal("0")
