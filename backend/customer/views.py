from customer.serializers import CustomerGetSerializer
from rest_framework import generics
from customer.models import Customer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerGetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # get param from request header
        name = self.request.query_params.get("name")
        level = self.request.query_params.get("level")
        points_from = self.request.query_params.get("pointsFrom")
        points_end = self.request.query_params.get("pointsEnd")
        email = self.request.query_params.get("email")
        phone = self.request.query_params.get("phone")

        # query
        if name:
            queryset = queryset.filter(name__icontains=name)

        if level:
            queryset = queryset.filter(level__iexact=level)

        if points_from and points_end:
            try:
                points_from = int(points_from)
                points_end = int(points_end)
                queryset = queryset.filter(
                    points__gte=points_from, points__lte=points_end
                )
            except ValueError:
                pass
        elif points_from:
            try:
                points_from = int(points_from)
                queryset = queryset.filter(points__gte=points_from)
            except ValueError:
                pass
        elif points_end:
            try:
                points_end = int(points_end)
                queryset = queryset.filter(points__lte=points_end)
            except ValueError:
                pass

        if email:
            queryset = queryset.filter(email__icontains=email)

        if phone:
            queryset = queryset.filter(phone__icontains=phone)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.data.get("name") and (
            not request.data.get("email") and not request.data.get("phone")
        ):
            return Response(
                {"error": "At least one of name, email, or phone is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerGetSerializer
    permission_classes = [IsAuthenticated]
