from rest_framework import generics
from order.models import Order, OrderItem
from order.serializers import OrderSerializer
from stock.models import Product, Stock
from customer.models import Customer
from rest_framework.response import Response
from rest_framework import status
import decimal


class OrderList(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        discount = request.data.get("discount", None)
        round_value = request.data.get("round", None)

        print(request.data)

        total = 0

        # check enough stock and process order in stock
        for item in request.data.get("items"):
            ordered_quantity = item.get("quantity")
            stock_id = item.get("stock_id")
            stock = Stock.objects.get(id=stock_id)
            try:
                if stock.quantity < ordered_quantity:
                    return Response(
                        {
                            "error": f"Not enough stock for {stock.product.name}({stock.size}) of {stock.color}."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                stock.quantity -= ordered_quantity
                total += stock.product.selling_price * ordered_quantity
                stock.save()
            except Stock.DoesNotExist:
                return Response(
                    {"error": f"Stock with ID {stock_id} not found."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # e.g. discount: 80
        if discount:
            total *= decimal.Decimal(discount) / decimal.Decimal(100)

        if round_value:
            total -= decimal.Decimal(round_value)

        # max_digits=6
        total = total.quantize(decimal.Decimal("0.01"), rounding=decimal.ROUND_HALF_UP)

        request.data["total"] = total

        # add points
        customer = Customer.objects.get(id=request.data["customer"])
        customer.points += int(total)
        customer.save()

        # create order
        response = super().create(request, *args, **kwargs)
        response.data["customer_name"] = customer.name

        return response
