from rest_framework import generics
from order.models import Order, OrderItem
from order.serializers import OrderSerializer
from stock.models import Product, Stock
from customer.models import Customer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import decimal
from django.db.models import Sum
from django.utils.timezone import now
from django.db.models.functions import TruncDay
from datetime import timedelta, date


class OrderList(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # get param from request header
        customer_name = self.request.query_params.get("customerName", None)

        # query
        if customer_name:
            queryset = queryset.filter(customer__name__icontains=customer_name)

        return queryset

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


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class SalesReportAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, start_date, end_date):
        return Order.objects.filter(
            create_time__date__gte=start_date,
            create_time__date__lte=end_date,
            status="P",  # Only consider Paid orders
        )

    def list(self, request, *args, **kwargs):
        current_date = now().date()
        seven_days_ago = current_date - timedelta(days=6)
        fourteen_days_ago = current_date - timedelta(days=13)
        yesterday = current_date - timedelta(days=1)
        start_of_year = date(current_date.year, 1, 1)  # Start of the current year

        # Sales of last 7 days
        last_7_days_sales = self.get_queryset(seven_days_ago, current_date)
        last_7_days_sales_data = (
            last_7_days_sales.annotate(day=TruncDay("create_time"))
            .values("day")
            .annotate(daily_total=Sum("total"))
            .order_by("day")
        )

        # Total sales for last 7 days
        last_7_days_total = (
            last_7_days_sales.aggregate(total=Sum("total"))["total"] or 0
        )

        # Sales in the previous 7 days (from 8-14 days ago)
        prev_7_days_sales = self.get_queryset(
            fourteen_days_ago, seven_days_ago - timedelta(days=1)
        )
        prev_7_days_total = (
            prev_7_days_sales.aggregate(total=Sum("total"))["total"] or 0
        )

        # Calculate percentage change for last 7 days vs previous 7 days
        if prev_7_days_total > 0:
            percentage_change = (
                (last_7_days_total - prev_7_days_total) / prev_7_days_total
            ) * 100
        else:
            percentage_change = 100

        # Total sales for today
        today_sales_total = (
            self.get_queryset(current_date, current_date).aggregate(total=Sum("total"))[
                "total"
            ]
            or 0
        )

        # Total sales for yesterday
        yesterday_sales_total = (
            self.get_queryset(yesterday, yesterday).aggregate(total=Sum("total"))[
                "total"
            ]
            or 0
        )

        # Calculate percentage change between today and yesterday
        if yesterday_sales_total > 0:
            today_vs_yesterday_percentage = (
                (today_sales_total - yesterday_sales_total) / yesterday_sales_total
            ) * 100
        else:
            today_vs_yesterday_percentage = 100

        # Sales difference between today and yesterday
        today_vs_yesterday_sales_change = today_sales_total - yesterday_sales_total

        # Year-to-date (YTD) total sales
        year_to_date_sales = (
            self.get_queryset(start_of_year, current_date).aggregate(
                total=Sum("total")
            )["total"]
            or 0
        )

        # Total order count for the year
        year_to_date_orders = Order.objects.filter(
            create_time__date__gte=start_of_year,
            status="P",  # Only consider Paid orders
        ).count()

        # Total orders today
        today_orders_total = Order.objects.filter(
            create_time__date=current_date, status="P"
        ).count()

        # Total orders yesterday
        yesterday_orders_total = Order.objects.filter(
            create_time__date=yesterday, status="P"
        ).count()

        # Calculate order percentage change between today and yesterday
        if yesterday_orders_total > 0:
            today_vs_yesterday_order_percentage = (
                (today_orders_total - yesterday_orders_total) / yesterday_orders_total
            ) * 100
        else:
            today_vs_yesterday_order_percentage = 100

        # Order difference between today and yesterday
        today_vs_yesterday_order_change = today_orders_total - yesterday_orders_total

        # Response data
        response_data = {
            "weekly": {
                "categories": [
                    entry["day"].strftime("%d %b")
                    for entry in last_7_days_sales_data  # e.g. "01 Feb"
                ],
                "series": [
                    {
                        "name": "Daily Sales",
                        "data": [
                            float(entry["daily_total"])
                            for entry in last_7_days_sales_data
                        ],
                    }
                ],
                "total": last_7_days_total,
                "percentage_change": percentage_change,
            },
            "total_sales": {
                "total": year_to_date_sales,  # YTD total sales
                "percentage_change": today_vs_yesterday_percentage,  # Today vs yesterday percentage change
                "sales_change": today_vs_yesterday_sales_change,  # Difference in sales between today and yesterday
            },
            "total_order": {
                "total": year_to_date_orders,  # YTD total orders
                "order_change": today_vs_yesterday_order_change,  # Order difference between today and yesterday
                "percentage_change": today_vs_yesterday_order_percentage,  # Percentage change in orders
            },
        }

        return Response(response_data)
