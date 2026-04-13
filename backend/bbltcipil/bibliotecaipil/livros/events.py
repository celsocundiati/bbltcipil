from bibliotecaipil.events import register_event



@register_event("reserva_criada")
def notificar_reserva_criada(payload):
    from livros.models import Notificacao
    from django.contrib.auth import get_user_model

    User = get_user_model()

    try:
        usuario = User.objects.get(id=payload["usuario_id"])

        Notificacao.objects.create(
            usuario=usuario,
            titulo="Reserva criada",
            descricao=f"Sua reserva do livro '{payload['titulo']}' foi criada com sucesso.",
            tipo="Reserva",
            link=f"/reservas#reserva-{payload['reserva_id']}"
        )

    except User.DoesNotExist:
        print(f"❌ Usuário não encontrado: {payload['usuario_id']}")


@register_event("reserva_cancelada")
def notificar_reserva_cancelada(payload):
    from livros.models import Notificacao
    from django.contrib.auth import get_user_model

    User = get_user_model()

    try:
        usuario = User.objects.get(id=payload["usuario_id"])

        Notificacao.objects.create(
            usuario=usuario,
            titulo="Reserva cancelada",
            descricao=f"A reserva do livro '{payload['titulo']}' foi cancelada.",
            tipo="Reserva",
            link="/reservas"
        )

    except User.DoesNotExist:
        print(f"❌ Usuário não encontrado: {payload['usuario_id']}")


