from celery import shared_task
from .services import gerar_resposta
from bibliotecaipil.events import emit_event


@shared_task
def processar_mensagem_task(pergunta, user_id, chat_id):
    from django.contrib.auth.models import User
    from chats.models import Chat  # ajusta se necessário

    user = User.objects.get(id=user_id)
    chat = Chat.objects.get(id=chat_id)

    resposta = gerar_resposta(pergunta, user, chat)

    # 🔥 Dispara evento depois da resposta
    emit_event("mensagem_processada", {
        "user_id": user_id,
        "chat_id": chat_id,
        "pergunta": pergunta,
        "resposta": resposta
    })

    return resposta