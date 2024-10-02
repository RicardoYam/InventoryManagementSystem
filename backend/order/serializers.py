from rest_framework import serializers
from order.models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.CharField(
        source="product.selling_price", read_only=True
    )
    color = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "product",
            "product_name",
            "product_price",
            "color",
            "size",
            "quantity",
            "order",
        ]
        extra_kwargs = {
            "order": {"required": False},
        }

    def get_color(self, obj):
        return obj.product.stocks.filter(id=obj.product.id).first().color

    def get_size(self, obj):
        return obj.product.stocks.filter(id=obj.product.id).first().size


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "method",
            "status",
            "total",
            "customer",
            "customer_name",
            "create_time",
            "items",
        ]
        extra_kwargs = {
            "total": {"required": False},
            "status": {"required": False},
        }

    def get_customer_name(self, obj):
        if obj.customer:
            return obj.customer.name
        return None

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
