# Generated by Django 5.0.7 on 2024-08-09 06:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('tag', models.CharField(choices=[('TSHIRT', 'T-Shirt'), ('SHIRT', 'Shirt'), ('PANTS', 'Pants'), ('JACKET', 'Jacket'), ('SWEATER', 'Sweater'), ('DRESS', 'Dress'), ('SKIRT', 'Skirt'), ('SHORTS', 'Shorts'), ('HOODIE', 'Hoodie'), ('SUIT', 'Suit'), ('COAT', 'Coat'), ('UNDERWEAR', 'Underwear'), ('ACCESSORIES', 'Accessories'), ('SHOES', 'Shoes')], max_length=15)),
                ('purchased_price', models.DecimalField(decimal_places=2, max_digits=2)),
                ('selling_price', models.DecimalField(decimal_places=2, max_digits=2)),
                ('image_name', models.CharField(max_length=50)),
                ('image_url', models.CharField(max_length=255)),
                ('image_type', models.CharField(max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('color', models.CharField(max_length=20)),
                ('size', models.CharField(choices=[('S', 'Small'), ('M', 'Medium'), ('L', 'Large'), ('XL', 'Extra Large'), ('O', 'One Size')], default='O', max_length=2)),
                ('quantity', models.IntegerField()),
                ('create_time', models.DateTimeField(auto_now_add=True)),
                ('update_time', models.DateTimeField(auto_now=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stock.product')),
            ],
        ),
    ]
