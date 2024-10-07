from django.contrib import admin

# Register your models here.
from .models import Stock, Product

admin.site.register(Stock)
admin.site.register(Product)
