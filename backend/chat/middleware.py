# backend/chat/middleware.py
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user(token_key):
    print("AUTH TOKEN KEY:", token_key)
    try:
        access_token = AccessToken(token_key)
        user_id = access_token["user_id"]
        return User.objects.get(id=user_id)
    except Exception as e:
        print("AUTH ERROR:", str(e))
        return AnonymousUser()

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token_key = query_params.get("token", [None])[0]
        scope["user"] = await get_user(token_key)
        return await self.inner(scope, receive, send)