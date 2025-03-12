from rest_framework import serializers
from .models import User, Ad, Resume, ResumeDocument


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ["username", "email", "is_client", "is_contractor", "avatar", "company_info", "address"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_client', 'is_contractor']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            is_client=validated_data.get('is_client', False),
            is_contractor=validated_data.get('is_contractor', False),
        )
        user.set_password(validated_data['password'])  # Шифруем пароль
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
    author = serializers.StringRelatedField(read_only=True)  # Показываем имя пользователя вместо ID
    author_id = serializers.IntegerField(source="author.id", read_only=True)

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


class ResumeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeDocument
        fields = ['id', 'file']


class ResumeSerializer(serializers.ModelSerializer):
    documents = ResumeDocumentSerializer(many=True, read_only=True)

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
            'created_at'
        ]
        read_only_fields = ['user', 'created_at']
