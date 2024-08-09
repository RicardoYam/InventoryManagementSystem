from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


class Customer(models.Model):

    # enum class for Level field
    class Level(models.TextChoices):
        # ... = value, label
        SILVER = "SL", _("Silver")
        GOLD = "GD", _("Gold")
        PLATINUM = "PL", _("Platinum")
        DIAMOND = "DM", _("Diamond")

    name = models.CharField(max_length=100)
    level = models.CharField(
        max_length=2,
        choices=Level,
        default=Level.SILVER,
    )
    points = models.IntegerField(default=0)
    credit = models.IntegerField(default=0)
    email = models.CharField(max_length=254, unique=True)
    phone = PhoneNumberField(region="AU")
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "customer"
        verbose_name = "Customer"
        verbose_name_plural = "Customer"
        ordering = ["name"]

    # override save function
    def save(self, *args, **kwargs):
        if 1000 <= self.points < 3000:
            self.level = self.Level.GOLD
        elif 3000 <= self.points < 7000:
            self.level = self.Level.PLATINUM
        elif 7000 <= self.points:
            self.level = self.Level.DIAMOND
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    # def get_absolute_url():
