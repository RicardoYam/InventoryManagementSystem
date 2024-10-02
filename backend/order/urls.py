from django.urls import path
from . import views

urlpatterns = [
    path("orders/", views.OrderList.as_view(), name="order-list"),
    path(
        "orders/<int:pk>/",
        views.OrderDetailView.as_view(),
        name="order-update",
    ),
    path("orders/sales/", views.SalesReportAPIView.as_view(), name="monthly_sales"),
]
