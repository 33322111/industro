from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_client', 'is_contractor']


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
