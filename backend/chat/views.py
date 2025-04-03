from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
from django.db.models import Q


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
