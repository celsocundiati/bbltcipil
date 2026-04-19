from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Chat, Mensagem
from .services import gerar_resposta
# from ai_assistant.tasks import processar_mensagem_task

# =========================
# 🆕 CRIAR CHAT
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def criar_chat(request):
    chat = Chat.objects.create(usuario=request.user)
    return Response({"chat_id": chat.id})


# =========================
# 📋 LISTAR CHATS
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_chats(request):
    chats = Chat.objects.filter(usuario=request.user).order_by("-criado_em")

    data = [{"id": c.id, "criado_em": c.criado_em} for c in chats]

    return Response(data)


# =========================
# 📩 LISTAR MENSAGENS
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_mensagens(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id, usuario=request.user)

    mensagens = Mensagem.objects.filter(chat=chat).order_by("criado_em")

    return Response([
        {"tipo": m.tipo, "texto": m.texto}
        for m in mensagens
    ])


# =========================
# 🤖 ENVIAR MENSAGEM
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    user = request.user
    mensagem = request.data.get("mensagem")
    chat_id = request.data.get("chat_id")

    if not mensagem or not chat_id:
        return Response({"erro": "Dados inválidos"}, status=400)

    chat = get_object_or_404(Chat, id=chat_id, usuario=user)

    # salvar user
    Mensagem.objects.create(chat=chat, tipo="user", texto=mensagem)

    # IA responde
    resposta = gerar_resposta(mensagem, user, chat)

    # salvar IA
    Mensagem.objects.create(chat=chat, tipo="ia", texto=resposta)

    return Response({"resposta": resposta})