from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_client = models.BooleanField(default=False)  # Заказчик
    is_contractor = models.BooleanField(default=False)  # Исполнитель
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    company_info = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username
