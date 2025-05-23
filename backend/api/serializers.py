from rest_framework import serializers
from .models import User, Ad, Resume, Subcategory, Category, Favourite
import re


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['id', 'avatar', 'password', "is_superuser", "username", "first_name", "last_name", "is_staff",
                  "email", "is_client", "is_contractor", "company_info", "address"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_client', 'is_contractor']

    def validate_username(self, value):
        if not re.match(r'^[A-Za-z0-9_]+$', value):
            raise serializers.ValidationError("Имя пользователя может содержать только буквы, цифры и подчёркивания.")
        if ' ' in value:
            raise serializers.ValidationError("Имя пользователя не должно содержать пробелы.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен содержать не менее 8 символов.")
        if not re.match(r'^[A-Za-z0-9@#$%^&+=!]+$', value):
            raise serializers.ValidationError("Пароль содержит недопустимые символы.")
        if ' ' in value:
            raise serializers.ValidationError("Пароль не должен содержать пробелы.")
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            is_client=validated_data.get('is_client', False),
            is_contractor=validated_data.get('is_contractor', False),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'profile']


class ProfileDetailSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    address = serializers.CharField(required=False)
    company_info = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['avatar', 'address', 'company_info', 'role']


class AdSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    author_id = serializers.IntegerField(source="author.id", read_only=True)

    # Названия категорий
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)

    class Meta:
        model = Ad
        fields = "__all__"

    def validate(self, data):
        # Валидация цены
        if data.get("price_type") == "fixed" and not data.get("fixed_price"):
            raise serializers.ValidationError("Пожалуйста, укажите фиксированную цену.")
        if data.get("price_type") == "range" and (not data.get("price_from") or not data.get("price_to")):
            raise serializers.ValidationError("Пожалуйста, укажите диапазон цен.")
        # Валидация сроков проекта
        if data.get("execution_time") == "urgent" and not data.get("project_deadline"):
            raise serializers.ValidationError("Пожалуйста, укажите сроки проекта.")
        return data


class ResumeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id',
            'user',
            'category',
            'subcategory',
            'title',
            'description',
            'price_type',
            'fixed_price',
            'price_from',
            'price_to',
            'location',
            'city',
            'documents',
            'created_at',
            'category_name',
            'subcategory_name'
        ]
        read_only_fields = ['user', 'created_at']


class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ('id', 'name')


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'subcategories')


class FavouriteSerializer(serializers.ModelSerializer):
    ad = AdSerializer(read_only=True)
    resume = ResumeSerializer(read_only=True)

    class Meta:
        model = Favourite
        fields = ['id', 'ad', 'resume', 'created_at']