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

    class Status(models.TextChoices):
        PAID = ("P", _("Paid"))
        REFUND = ("R", _("Refund"))
        UNPAID = ("U", _("Unpaid"))

    method = models.CharField(max_length=2, choices=Method)
    total = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.CharField(max_length=1, choices=Status, default=Status.PAID)
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, null=True, blank=True, related_name="orders"
    )
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "order"
        verbose_name = "Order"
        verbose_name_plural = "Order"
        ordering = ["-create_time"]

    def __str__(self):
        return "Ordered by customer %s, total %s" % (self.customer.name, self.total)


class OrderItem(models.Model):

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, null=True, blank=True, related_name="items"
    )
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=True, blank=True, related_name="items"
    )
    stock_id = models.IntegerField(null=True, blank=True)
    quantity = models.IntegerField()

    class Meta:
        db_table = "order_item"
        verbose_name = "Order Item"
        verbose_name_plural = "Order Item"

    def __str__(self):
        return "Product: %s, Quantity: %s for Order ID: %s" % (
            self.product.name,
            self.quantity,
            self.order.id,
        )
