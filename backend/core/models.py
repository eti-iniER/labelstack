from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from core.querysets import OrderQuerySet, AddressQuerySet, PackageQuerySet

# Create your models here.


class Address(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    address_2 = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="USA")
    is_user_created = models.BooleanField(
        default=False
    )  # Indicates if the address was manually saved by the user

    def __str__(self):
        return f"{self.name} - {self.address}"

    objects = AddressQuerySet.as_manager()


class Package(models.Model):
    length = models.PositiveIntegerField()
    width = models.PositiveIntegerField()
    height = models.PositiveIntegerField()
    weight = models.PositiveIntegerField()  # weight in OUNCES
    item_sku = models.CharField(max_length=255, blank=True)
    is_user_created = models.BooleanField(
        default=False
    )  # Indicates if the package was manually saved by the user

    def __str__(self):
        return f"Package {self.id} - {self.weight} oz"

    objects = PackageQuerySet.as_manager()


class OrderParty(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)


class ShippingProvider(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    cost_per_pound = models.DecimalField(max_digits=10, decimal_places=2)


class Order(models.Model):
    sender = models.ForeignKey(
        "OrderParty", related_name="sent_orders", on_delete=models.CASCADE
    )
    recipient = models.ForeignKey(
        "OrderParty", related_name="received_orders", on_delete=models.CASCADE
    )
    from_address = models.ForeignKey(
        "Address", related_name="sent_orders", on_delete=models.CASCADE
    )
    to_address = models.ForeignKey(
        "Address", related_name="received_orders", on_delete=models.CASCADE
    )
    package = models.ForeignKey("Package", on_delete=models.CASCADE)
    shipping_provider = models.ForeignKey(
        "ShippingProvider", on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    phone_number = PhoneNumberField()
    phone_number_2 = PhoneNumberField(blank=True)

    objects = OrderQuerySet.as_manager()
