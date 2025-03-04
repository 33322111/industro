# Generated by Django 5.1.4 on 2025-03-04 11:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_address_user_avatar_user_company_info'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=255)),
                ('subcategory', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('price_type', models.CharField(choices=[('fixed', 'Фиксированная цена'), ('range', 'Диапазон'), ('negotiable', 'Договорная')], max_length=20)),
                ('price_from', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('price_to', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('fixed_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('execution_time', models.CharField(choices=[('one_time', 'Разовое задание'), ('long_term', 'Долгосрочное сотрудничество'), ('urgent', 'Срочный проект')], max_length=20)),
                ('project_deadline', models.IntegerField(blank=True, null=True)),
                ('location', models.CharField(choices=[('on_site', 'На месте'), ('remote', 'Удаленно')], max_length=10)),
                ('city', models.CharField(blank=True, max_length=255, null=True)),
                ('documents', models.FileField(blank=True, null=True, upload_to='ad_documents/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ads', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
