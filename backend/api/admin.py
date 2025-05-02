from django.contrib import admin
from django.utils.html import format_html
from .models import User, Category, Subcategory, Ad, Resume, Favourite

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_client", "is_contractor", "avatar_preview", "is_staff")
    list_filter = ("is_client", "is_contractor", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    readonly_fields = ("avatar_preview",)
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Роли", {"fields": ("is_client", "is_contractor")}),
        ("Персональное", {"fields": ("avatar", "avatar_preview", "company_info", "address")}),
        ("Права", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )

    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="40" style="border-radius: 50%" />', obj.avatar.url)
        return "—"
    avatar_preview.short_description = "Аватар"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category")
    list_filter = ("category",)
    search_fields = ("name",)

@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "subcategory", "price_type", "execution_time", "location", "created_at")
    list_filter = ("category", "subcategory", "price_type", "execution_time", "location")
    search_fields = ("title", "description", "author__username")
    date_hierarchy = "created_at"
    autocomplete_fields = ("author", "category", "subcategory")

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "category", "subcategory", "price_type", "location", "created_at")
    list_filter = ("category", "subcategory", "price_type", "location")
    search_fields = ("title", "description", "user__username")
    date_hierarchy = "created_at"
    autocomplete_fields = ("user", "category", "subcategory")

@admin.register(Favourite)
class FavouriteAdmin(admin.ModelAdmin):
    list_display = ("user", "ad_display", "resume_display", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "ad__title", "resume__title")

    def ad_display(self, obj):
        return obj.ad.title if obj.ad else "—"
    ad_display.short_description = "Объявление"

    def resume_display(self, obj):
        return obj.resume.title if obj.resume else "—"
    resume_display.short_description = "Резюме"