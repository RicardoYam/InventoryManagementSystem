# Generated by Django 5.0.7 on 2024-09-13 07:51

import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0004_remove_customer_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='email',
            field=models.CharField(blank=True, max_length=254, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region='AU'),
        ),
    ]
