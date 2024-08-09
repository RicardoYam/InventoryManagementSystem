from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("customer.urls")),
    path("api/v1/", include("order.urls")),
    path("api/v1/", include("stock.urls")),
]
