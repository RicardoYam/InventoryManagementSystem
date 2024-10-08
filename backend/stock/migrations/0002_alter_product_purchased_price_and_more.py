# Generated by Django 5.0.7 on 2024-08-09 09:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='purchased_price',
            field=models.DecimalField(decimal_places=2, max_digits=5),
        ),
        migrations.AlterField(
            model_name='product',
            name='selling_price',
            field=models.DecimalField(decimal_places=2, max_digits=5),
        ),
    ]
