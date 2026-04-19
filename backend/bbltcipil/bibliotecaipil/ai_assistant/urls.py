from django.urls import path
from .views import criar_chat, listar_chats, listar_mensagens, chat

urlpatterns = [
    path("chat/criar/", criar_chat),
    path("chat/listar/", listar_chats),
    path("chat/<int:chat_id>/mensagens/", listar_mensagens),
    path("chat/enviar/", chat),
]