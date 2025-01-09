from django.contrib import admin
from .models import User

@admin.register(User)  # Регистрация с настройками
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_client', 'is_contractor')  # Отображаемые поля в списке
    search_fields = ('username', 'email')  # Поля для поиска
    list_filter = ('is_client', 'is_contractor')  # Фильтры
