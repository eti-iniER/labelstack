from django.urls import path
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from api.views import (
    OrderViewSet,
    AddressViewSet,
    ShippingProviderViewSet,
    PackageViewSet,
    JobViewSet,
)

app_name = "api"

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="orders")
router.register(r"addresses", AddressViewSet, basename="addresses")
router.register(r"packages", PackageViewSet, basename="packages")
router.register(
    r"shipping-providers", ShippingProviderViewSet, basename="shipping-providers"
)
router.register(r"jobs", JobViewSet, basename="jobs")


urlpatterns = [
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

urlpatterns += router.urls
