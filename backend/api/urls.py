from django.urls import path
from .views import UserListView, UserDetailView, RegisterView, ProfileDetailView, AdListCreateView, AdDetailView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegisterView.as_view(), name='register'),

    path("profile/", ProfileDetailView.as_view(), name="profile"),

    path('ads/', AdListCreateView.as_view(), name='ad-list-create'),
    path('ads/<int:pk>/', AdDetailView.as_view(), name='ad-detail'),

]

