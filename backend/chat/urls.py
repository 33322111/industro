from django.urls import path
from .views import ChatHistoryView, UnreadMessagesCountView, MarkMessagesAsReadView, UserDialogsView

urlpatterns = [
    path("history/<str:room_name>/", ChatHistoryView.as_view(), name="chat-history"),
    path('unread-count/', UnreadMessagesCountView.as_view(), name='unread-messages-count'),
    path('mark-read/<str:room_name>/', MarkMessagesAsReadView.as_view(), name='mark-messages-read'),
    path("dialogs/", UserDialogsView.as_view(), name="user-dialogs"),
]