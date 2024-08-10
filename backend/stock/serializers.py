from rest_framework import serializers
from stock.models import Stock, Product


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"
        # for update, need to specify the stock.id
        extra_kwargs = {"id": {"read_only": False, "required": True}}


class ProductSerializer(serializers.ModelSerializer):
    stocks = StockSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):
        stocks_data = validated_data.pop("stocks")
        product = Product.objects.create(**validated_data)
        for stock_data in stocks_data:
            Stock.objects.create(product=product, **stock_data)
        return product

    def update(self, instance, validated_data):
        stocks_data = validated_data.pop("stocks")

        instance.name = validated_data.get("name", instance.name)
        instance.type = validated_data.get("tag", instance.type)
        instance.purchased_price = validated_data.get(
            "purchased_price", instance.purchased_price
        )
        instance.selling_price = validated_data.get(
            "selling_price", instance.selling_price
        )
        instance.image_name = validated_data.get("image_name", instance.image_name)
        instance.image_url = validated_data.get("image_url", instance.image_url)
        instance.image_type = validated_data.get("image_type", instance.image_type)
        instance.save()

        for stock_data in stocks_data:
            stock_id = stock_data.get("id")
            if stock_id:
                try:
                    stock = Stock.objects.get(id=stock_id, product=instance)
                    quantity = stock_data.get("quantity", stock.quantity)

                    if quantity == 0:
                        stock.delete()
                    else:
                        stock.color = stock_data.get("color", stock.color)
                        stock.size = stock_data.get("size", stock.size)
                        stock.quantity = quantity
                        stock.save()
                except Stock.DoesNotExist:
                    print(f"Stock ID {stock_id} not found for product {instance.name}")
        return instance
