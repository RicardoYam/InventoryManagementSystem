from django.urls import path
from . import views

urlpatterns = [
    path("inventories/", views.StockListCreateView.as_view(), name="inventory-list"),
    path(
        "inventories/<int:pk>/",
        views.StockRetrieveDeleteUpdateView.as_view(),
        name="inventory-update",
    ),
    path(
        "inventories/report/",
        views.StockReportAPIView.as_view(),
        name="inventory-report",
    ),
]
