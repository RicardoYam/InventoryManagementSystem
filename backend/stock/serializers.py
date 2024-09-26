from rest_framework import serializers
from stock.models import Stock, Product


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    stocks = StockSerializer(many=True)
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "type",
            "purchased_price",
            "selling_price",
            "image_name",
            "image_url",
            "image_type",
            "total_quantity",
            "stocks",
        ]
        extra_kwargs = {
            "image_name": {"required": False},
            "image_url": {"required": False},
            "image_type": {"required": False},
        }

    def get_total_quantity(self, obj):
        return sum(stock.quantity for stock in obj.stocks.all())

    def create(self, validated_data):
        stocks_data = validated_data.pop("stocks")
        product = Product.objects.create(**validated_data)
        for stock_data in stocks_data:
            Stock.objects.create(product=product, **stock_data)
        return product

    def update(self, instance, validated_data):
        stocks_data = validated_data.pop("stocks", None)

        instance.name = validated_data.get("name", instance.name)
        instance.type = validated_data.get("type", instance.type)
        instance.purchased_price = validated_data.get(
            "purchased_price", instance.purchased_price
        )
        instance.selling_price = validated_data.get(
            "selling_price", instance.selling_price
        )

        instance.save()

        if stocks_data:
            existing_stock_ids = [stock.id for stock in instance.stocks.all()]
            updated_stock_ids = []

            for stock_data in stocks_data:
                stock_id = stock_data.get("id")
                if stock_id:
                    try:
                        stock = Stock.objects.get(id=stock_id, product=instance)
                        stock.color = stock_data.get("color", stock.color)
                        stock.size = stock_data.get("size", stock.size)
                        stock.quantity = stock_data.get("quantity", stock.quantity)
                        stock.save()
                        updated_stock_ids.append(stock_id)
                    except Stock.DoesNotExist:
                        print(
                            f"Stock ID {stock_id} not found for product {instance.name}"
                        )
                else:
                    new_stock = Stock.objects.create(product=instance, **stock_data)
                    updated_stock_ids.append(new_stock.id)

            # Delete any stocks that are no longer in the updated payload
            for stock_id in existing_stock_ids:
                if stock_id not in updated_stock_ids:
                    Stock.objects.filter(id=stock_id).delete()

        return instance
