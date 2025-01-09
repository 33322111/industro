from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_client = models.BooleanField(default=False)  # Заказчик
    is_contractor = models.BooleanField(default=False)  # Исполнитель

    def __str__(self):
        return self.username
