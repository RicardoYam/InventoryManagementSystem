from rest_framework import serializers
from customer.models import Customer


class CustomerGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class CustomerGetLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "level", "points", "create_time"]
        read_only_fields = ["id", "name", "level", "points", "create_time"]


class CustomerPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "email", "phone"]
        read_only_fields = ["id"]
