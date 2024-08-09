from customer.serializers import (
    CustomerGetSerializer,
    CustomerGetLiteSerializer,
    CustomerPostSerializer,
)
from rest_framework import generics
from customer.models import Customer


class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CustomerPostSerializer
        # return a lite version
        return CustomerGetLiteSerializer


class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerGetSerializer
