from rest_framework import generics
from stock.serializers import ProductSerializer
from stock.models import Stock, Product
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, F
from django.utils.timezone import now
from rest_framework.response import Response
from datetime import timedelta
import boto3
import uuid
import mimetypes
import json

AWS_S3_REGION = "us-east-1"
AWS_STORAGE_BUCKET_NAME = "ivm-test-ricardo"


class StockListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        name = self.request.query_params.get("name")

        # filter query
        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset

    def create(self, request, *args, **kwargs):
        image_file = request.FILES.get("image")
        image_name = None
        image_type = None
        image_url = None

        stocks_data = request.data.get("stocks")
        try:
            if isinstance(stocks_data, str):
                stocks_data = json.loads(stocks_data)
                # make request mutable
                request.data._mutable = True
                request.data["stocks"] = stocks_data
                request.data._mutable = False
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON format for stocks."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if image_file:
            image_name = (
                f"{uuid.uuid4()}{mimetypes.guess_extension(image_file.content_type)}"
            )
            image_type = mimetypes.guess_type(image_file.name)[0]

            s3 = boto3.client("s3")

            try:
                s3.upload_fileobj(
                    image_file,
                    AWS_STORAGE_BUCKET_NAME,
                    image_name,
                    ExtraArgs={"ContentType": image_file.content_type},
                )
                image_url = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION}.amazonaws.com/{image_name}"
            except Exception as e:
                return Response(
                    {"error": "Failed to upload image to S3", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid()

        product = serializer.save(
            image_name=image_name, image_url=image_url, image_type=image_type
        )

        response_serializer = self.get_serializer(product)

        headers = self.get_success_headers(response_serializer.data)
        return Response(
            response_serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class StockRetrieveDeleteUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Get the current product object before update
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        image_file = request.FILES.get("image")
        image_name = None
        image_type = None
        image_url = None

        if image_file:
            image_name = (
                f"{uuid.uuid4()}{mimetypes.guess_extension(image_file.content_type)}"
            )
            image_type = mimetypes.guess_type(image_file.name)[0]

            s3 = boto3.client("s3")
            try:
                s3.upload_fileobj(
                    image_file,
                    AWS_STORAGE_BUCKET_NAME,
                    image_name,
                    ExtraArgs={"ContentType": image_file.content_type},
                )
                image_url = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION}.amazonaws.com/{image_name}"
            except Exception as e:
                return Response(
                    {"error": "Failed to upload image to S3", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        stocks_data = request.data.get("stocks")
        if isinstance(stocks_data, str):
            try:
                stocks_data = json.loads(stocks_data)
                request.data._mutable = True
                request.data["stocks"] = stocks_data
                request.data._mutable = False
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid JSON format for stocks."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if image_url:
            instance.image_url = image_url
            instance.image_name = image_name
            instance.image_type = image_type

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class StockReportAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self, start_date, end_date):
        return Product.objects.filter(
            stocks__create_time__gte=start_date, stocks__create_time__lte=end_date
        ).distinct()

    def list(self, request, *args, **kwargs):
        current_date = now().date()
        start_of_year = current_date.replace(month=1, day=1)

        filtered_products = self.get_queryset(start_of_year, current_date)

        total_cost_price = (
            Stock.objects.filter(product__in=filtered_products).aggregate(
                total_cost=Sum(F("product__purchased_price") * F("quantity"))
            )["total_cost"]
            or 0
        )

        total_stocks = (
            Stock.objects.filter(product__in=filtered_products).aggregate(
                total_stocks=Sum("quantity")
            )["total_stocks"]
            or 0
        )

        response_data = {
            "total_cost_price": {
                "total_cost": total_cost_price,
            },
            "total_stocks_number": {
                "total_stocks": total_stocks,
            },
        }

        return Response(response_data)
