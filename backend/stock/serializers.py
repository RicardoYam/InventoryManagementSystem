from rest_framework import serializers
from stock.models import Stock, Product


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


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
