from django.db import models
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from core.models import Address, Package, ShippingProvider


class OrderQuerySet(models.QuerySet):
    def update_package(self, package: "Package") -> int:
        return self.update(package=package)

    def update_from_address(self, address: "Address") -> int:
        return self.update(from_address=address)

    def update_shipping_provider(self, provider: "ShippingProvider") -> int:
        return self.update(shipping_provider=provider)


class AddressQuerySet(models.QuerySet):
    def user_created(self):
        return self.filter(is_user_created=True)


class PackageQuerySet(models.QuerySet):
    def user_created(self):
        return self.filter(is_user_created=True)
