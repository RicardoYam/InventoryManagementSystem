from django.urls import path
from . import views

urlpatterns = [
    path("stocks/", views.ProductListCreateView.as_view(), name="stock-list"),
]
