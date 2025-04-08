import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from .models import Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']  # e.g. "user_13"
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        print("self.scope['user']:", self.scope["user"])
        data = json.loads(text_data)
        message = data['message']
        sender = self.scope["user"]

        # Проверка, что пользователь аутентифицирован
        if not sender.is_authenticated:
            await self.close()
            return

        # Извлечение recipient_id из room_name
        try:
            recipient_id = int(self.room_name.split("_")[1])
            recipient = await sync_to_async(User.objects.get)(id=recipient_id)
        except (IndexError, ValueError, User.DoesNotExist):
            await self.send(text_data=json.dumps({"error": "Invalid recipient"}))
            return

        # Сохраняем сообщение
        await sync_to_async(Message.objects.create)(
            sender=sender,
            recipient=recipient,
            message=message,
            is_read=(sender == recipient)
        )

        # Отправляем сообщение всем в комнате
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender.username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
        }))
