from django.db import models
from django.utils.translation import gettext_lazy as _
from stock.models import Product
from customer.models import Customer


class Order(models.Model):

    # enum class for Method field
    class Method(models.TextChoices):
        ALIPAY = ("AL", _("AliPay"))
        WECHAT = ("WE", _("WeChat"))
        CREDITCARD = ("CC", _("Credit Card"))
        CASH = ("CA", _("Cash"))
        CREDIT = ("CR", _("Credit"))

    method = models.CharField(max_length=2, choices=Method)
    total = models.DecimalField(max_digits=6, decimal_places=2)
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, null=True, blank=True, related_name="orders"
    )
    create_time = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, null=True, blank=True, related_name="items"
    )
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=True, blank=True, related_name="items"
    )
    quantity = models.IntegerField()
