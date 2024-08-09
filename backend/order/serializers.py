from rest_framework import serializers
from order.models import Order, OrderItem


class OrderGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class OrderPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
