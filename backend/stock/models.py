from django.db import models
from django.utils.translation import gettext_lazy as _


class Product(models.Model):

    # enum class for Type field
    class Type(models.TextChoices):
        TSHIRT = ("TSHIRT", _("T-Shirt"))
        SHIRT = ("SHIRT", _("Shirt"))
        PANTS = ("PANTS", _("Pants"))
        JACKET = ("JACKET", _("Jacket"))
        SWEATER = ("SWEATER", _("Sweater"))
        DRESS = ("DRESS", _("Dress"))
        SKIRT = ("SKIRT", _("Skirt"))
        SHORTS = ("SHORTS", _("Shorts"))
        HOODIE = ("HOODIE", _("Hoodie"))
        SUIT = ("SUIT", _("Suit"))
        COAT = ("COAT", _("Coat"))
        UNDERWEAR = ("UNDERWEAR", _("Underwear"))
        ACCESSORIES = ("ACCESSORIES", _("Accessories"))
        SHOES = ("SHOES", _("Shoes"))

    name = models.CharField(max_length=50)
    type = models.CharField(max_length=15, choices=Type)
    # max_digits is INCLUDING decimal_places
    purchased_price = models.DecimalField(max_digits=5, decimal_places=2)
    selling_price = models.DecimalField(max_digits=5, decimal_places=2)
    image_name = models.CharField(max_length=50)
    image_url = models.CharField(max_length=255)
    image_type = models.CharField(max_length=15)

    class Meta:
        db_table = "product"
        verbose_name = "Product"
        verbose_name_plural = "Product"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Stock(models.Model):

    # enum class for Size field
    class Size(models.TextChoices):
        S = ("S", _("Small"))
        M = ("M", _("Medium"))
        L = ("L", _("Large"))
        XL = ("XL", _("Extra Large"))
        O = ("O", _("One Size"))

    color = models.CharField(max_length=20)
    size = models.CharField(max_length=2, choices=Size, default=Size.O)
    quantity = models.IntegerField()
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, null=True, blank=True, related_name="stocks"
    )
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stock"
        verbose_name = "Stock"
        verbose_name_plural = "Stock"
        ordering = ["-create_time"]

    def save(self, *args, **kwargs):
        if self.quantity == 0:
            self.delete
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return self.color + " " + self.size + " " + self.quantity
