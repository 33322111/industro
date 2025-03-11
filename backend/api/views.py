from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Ad, Resume, ResumeDocument
from .serializers import UserSerializer, RegisterSerializer, AdSerializer, ResumeSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


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
        return Ad.objects.all().filter(author=self.request.user)


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
