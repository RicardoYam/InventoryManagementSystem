from rest_framework import serializers
from customer.models import Customer


class CustomerGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
        extra_kwargs = {
            "email": {"required": False, "allow_blank": True},
            "phone": {"required": False, "allow_blank": True},
            "name": {"required": True},
        }

    def validate(self, data):
        if not data.get("name"):
            raise serializers.ValidationError("You must provide name!")
        if not data.get("email") and not data.get("phone"):
            raise serializers.ValidationError(
                "You must provide at least email or phone!"
            )
        return data
