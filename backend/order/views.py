from rest_framework import generics
from order.models import Order, OrderItem
from order.serializers import OrderGetSerializer


class OrderList(generics.ListCreateAPIView):
    serializer_class = OrderGetSerializer

    def get_queryset(self):
        customer_id = self.kwargs["pk"]
        return Order.objects.filter(customer_id=customer_id)

    def perform_create(self, serializer):
        customer_id = self.kwargs["pk"]
        serializer.save(customer_id=customer_id)
