import django_filters
from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Ad, Resume, Category
from .serializers import UserSerializer, RegisterSerializer, AdSerializer, ResumeSerializer, ProfileSerializer, \
    CategorySerializer
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from asgiref.sync import sync_to_async
from django.core.mail import send_mail


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data.copy()

        # Проверяем загрузку файла
        if "avatar" in request.FILES:
            data["avatar"] = request.FILES["avatar"]

        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # print("Данные сохранены в БД:", serializer.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdListCreateView(generics.ListCreateAPIView):
    queryset = Ad.objects.all().order_by("-created_at")
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  # Автоматически устанавливаем текущего пользователя автором


class AdDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Ad.objects.all()


class UserAdsView(generics.ListAPIView):
    """
    API для получения всех объявлений текущего пользователя.
    """
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticated]  # Только авторизованные пользователи

    def get_queryset(self):
        return Ad.objects.filter(author=self.request.user).order_by("-created_at")


class ResumeListCreateView(generics.ListCreateAPIView):
    queryset = Resume.objects.all().order_by("-created_at")
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Resume.objects.all()


class UserResumesView(generics.ListAPIView):
    """
    API для получения всех резюме текущего пользователя.
    """
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]  # Только авторизованные пользователи

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by("-created_at")


class AdFilter(django_filters.FilterSet):
    # Фильтры по цене (ценовой диапазон)
    price_from = django_filters.NumberFilter(field_name="price_from", lookup_expr='gte')
    price_to = django_filters.NumberFilter(field_name="price_to", lookup_expr='lte')

    # Категория и подкатегория
    category = django_filters.NumberFilter(field_name="category__id")
    subcategory = django_filters.NumberFilter(field_name="subcategory__id")

    # Локация (on_site / remote)
    location = django_filters.CharFilter(field_name="location")

    # Время выполнения задачи
    execution_time = django_filters.CharFilter(field_name="execution_time")

    # Город, если location=on_site
    city = django_filters.CharFilter(field_name="city", lookup_expr='icontains')

    class Meta:
        model = Ad
        fields = [
            'category',
            'subcategory',
            'price_from',
            'price_to',
            'execution_time',
            'location',
            'city',
        ]


class AdFilterView(generics.ListAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = AdFilter

    ordering_fields = ['created_at', 'price_from', 'price_to']
    ordering = ['-created_at']


class AdSearchView(generics.ListAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, OrderingFilter]

    # Поиск по полям title и description
    search_fields = ['title', 'description']

    # Фильтрация через кастомный FilterSet
    filterset_class = AdFilter

    ordering_fields = ['created_at', 'price_from', 'price_to']
    ordering = ['-created_at']


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.prefetch_related('subcategories').all()
    serializer_class = CategorySerializer


class ResumeFilter(django_filters.FilterSet):
    # Фильтры по цене (ценовой диапазон)
    price_from = django_filters.NumberFilter(field_name="price_from", lookup_expr='gte')
    price_to = django_filters.NumberFilter(field_name="price_to", lookup_expr='lte')

    # Категория и подкатегория
    category = django_filters.NumberFilter(field_name="category__id")
    subcategory = django_filters.NumberFilter(field_name="subcategory__id")

    # Локация (on_site / remote)
    location = django_filters.CharFilter(field_name="location")

    # Город, если location=on_site
    city = django_filters.CharFilter(field_name="city", lookup_expr='icontains')

    class Meta:
        model = Resume
        fields = [
            'category',
            'subcategory',
            'price_from',
            'price_to',
            'location',
            'city',
        ]


class ResumeSearchView(generics.ListAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, OrderingFilter]

    # Поиск по названию и описанию резюме
    search_fields = ['title', 'description']

    # Кастомный фильтр
    filterset_class = ResumeFilter

    ordering_fields = ['created_at', 'price_from', 'price_to']
    ordering = ['-created_at']

User = get_user_model()
token_generator = PasswordResetTokenGenerator()

class PasswordResetView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email обязателен'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Пользователь с таким email не найден.'}, status=404)

        # Генерируем токен и ссылку
        token = token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{user.pk}/{token}/"

        # Отправляем письмо
        try:
            send_mail(
                subject='Восстановление пароля',
                message=f'Для восстановления пароля перейдите по ссылке:\n{reset_url}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            return Response({'message': 'Письмо отправлено, проверьте почту!'})
        except Exception as e:
            print(e)
            return Response({'error': 'Ошибка при отправке письма.'}, status=500)

class PasswordResetConfirmView(APIView):
    authentication_classes = []
    permission_classes = []
    """
    Пользователь присылает новый пароль вместе с uid и токеном.
    """
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not (uid and token and new_password):
            return Response({"error": "Все поля обязательны"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, pk=uid)

        if not token_generator.check_token(user, token):
            return Response({"error": "Неверный токен или токен устарел"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Пароль успешно изменён"})