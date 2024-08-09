from django.urls import path
from . import views

urlpatterns = [
    path("customers/<int:pk>/orders/", views.OrderList.as_view(), name="orderList"),
]
