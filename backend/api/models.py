from django.contrib.auth.models import AbstractUser
from django.db import models

from django.conf import settings


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_client = models.BooleanField(default=False)  # Заказчик
    is_contractor = models.BooleanField(default=False)  # Исполнитель
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    company_info = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username


class Ad(models.Model):
    PRICE_TYPE_CHOICES = [
        ('fixed', 'Фиксированная цена'),
        ('range', 'Диапазон'),
        ('negotiable', 'Договорная'),
    ]

    EXECUTION_TIME_CHOICES = [
        ('one_time', 'Разовое задание'),
        ('long_term', 'Долгосрочное сотрудничество'),
        ('urgent', 'Срочный проект'),
    ]

    LOCATION_CHOICES = [
        ('on_site', 'На месте'),
        ('remote', 'Удаленно'),
    ]

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ads")
    category = models.CharField(max_length=255)
    subcategory = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price_type = models.CharField(max_length=20, choices=PRICE_TYPE_CHOICES)
    price_from = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    price_to = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    fixed_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    execution_time = models.CharField(max_length=20, choices=EXECUTION_TIME_CHOICES)
    project_deadline = models.IntegerField(blank=True, null=True)  # В днях
    location = models.CharField(max_length=10, choices=LOCATION_CHOICES)
    city = models.CharField(max_length=255, blank=True, null=True)
    documents = models.FileField(upload_to="ad_documents/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
