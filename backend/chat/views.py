from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
from django.db.models import Max, Q


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_name):
        # Извлекаем id из room_name (например, user_13 → 13)
        recipient_id = int(room_name.replace("user_", ""))
        user = request.user

        messages = Message.objects.filter(
            Q(sender=user, recipient_id=recipient_id) |
            Q(sender_id=recipient_id, recipient=user)
        ).order_by("timestamp")

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class UnreadMessagesCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(recipient=request.user, is_read=False).count()
        return Response({"unread_count": count})


class MarkMessagesAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_name):
        try:
            # формат room_name: user_{sender_id}
            sender_id = int(room_name.split("_")[1])
        except (IndexError, ValueError):
            return Response({"error": "Invalid room name"}, status=400)

        Message.objects.filter(
            sender_id=sender_id,
            recipient=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"status": "messages marked as read"})


class UserDialogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Найти всех собеседников
        messages = Message.objects.filter(Q(sender=user) | Q(recipient=user))
        latest_per_dialog = (
            messages
            .values('sender', 'recipient')
            .annotate(last_time=Max('timestamp'))
            .order_by('-last_time')
        )

        dialogs = []
        seen = set()

        for m in messages.order_by('-timestamp'):
            other_user = m.recipient if m.sender == user else m.sender
            if other_user.id not in seen:
                seen.add(other_user.id)

                unread_count = Message.objects.filter(
                    sender=other_user,
                    recipient=user,
                    is_read=False
                ).count()

                dialogs.append({
                    'user_id': other_user.id,
                    'username': other_user.username,
                    'avatar': other_user.avatar.url if other_user.avatar else None,
                    'last_message': m.message,
                    'timestamp': m.timestamp,
                    'unread_count': unread_count,
                })

        return Response(dialogs)
