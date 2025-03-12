from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserListView, UserDetailView, RegisterView, ProfileDetailView,
    AdListCreateView, AdDetailView, UserAdsView,
    ResumeListCreateView, ResumeDetailView, UserResumesView, AdSearchView
)

urlpatterns = [
    # Пользователи
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Аутентификация
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Регистрация
    path('register/', RegisterView.as_view(), name='register'),

    # Профиль
    path("profile/", ProfileDetailView.as_view(), name="profile"),
    path('profile/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Объявления
    path('ads/', AdListCreateView.as_view(), name='ad-list-create'),
    path('ads/<int:pk>/', AdDetailView.as_view(), name='ad-detail'),
    path('user-ads/', UserAdsView.as_view(), name='user-ads'),

    # Резюме
    path('resumes/', ResumeListCreateView.as_view(), name='resume-list-create'),
    path('resumes/<int:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
    path('user-resumes/', UserResumesView.as_view(), name='user-resumes'),

    # Поиск
    path('ads/search/', AdSearchView.as_view(), name='ad-search'),
]
