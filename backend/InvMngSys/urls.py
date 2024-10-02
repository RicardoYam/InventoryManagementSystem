from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("customer.urls")),
    path("api/v1/", include("order.urls")),
    path("api/v1/", include("stock.urls")),
    path("api/v1/", include("user.urls")),
    path("api/v1/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
