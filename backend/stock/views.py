from rest_framework import generics
from stock.serializers import ProductSerializer
from stock.models import Stock, Product


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
