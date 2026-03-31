from bibliotecaipil.events import register_event


# @register_event("reserva_cancelada")
# def notificar_reserva_cancelada(payload):
#     from livros.models import Reserva, Notificacao

#     r = Reserva.objects.get(id=payload["reserva_id"])
#     perfil = r.perfil_oficial
#     usuario = perfil.user if perfil else r.usuario

#     Notificacao.objects.get_or_create(
#         usuario=usuario,
#         titulo="Reserva cancelada",
#         descricao=f"A reserva do livro '{r.livro.titulo}' foi cancelada.",
#         defaults={"tipo": "Reserva", "link": f"/reservas#reserva-{r.id}"}
#     )
@register_event("reserva_cancelada")
def notificar_reserva_cancelada(payload):
    from livros.models import Notificacao
    from django.contrib.auth import get_user_model

    User = get_user_model()

    try:
        usuario = User.objects.get(id=payload["usuario_id"])

        Notificacao.objects.get_or_create(
            usuario=usuario,
            titulo="Reserva cancelada",
            descricao=f"A reserva do livro '{payload['titulo']}' foi cancelada.",
            defaults={
                "tipo": "Reserva",
                "link": f"/reservas"
            }
        )
    except User.DoesNotExist:
        print(f"❌ Usuário não encontrado: {payload['usuario_id']}")

@register_event("reserva_criada")
def notificar_reserva_criada(payload):
    from livros.models import Reserva, Notificacao

    r = Reserva.objects.get(id=payload["reserva_id"])
    perfil = r.perfil_oficial
    usuario = perfil.user if perfil else r.usuario

    Notificacao.objects.get_or_create(
        usuario=usuario,
        titulo="Reserva criada",
        descricao=f"Sua reserva do livro '{r.livro.titulo}' foi criada com sucesso.",
        defaults={
            "tipo": "Reserva",
            "link": f"/reservas#reserva-{r.id}"
        }
    )



