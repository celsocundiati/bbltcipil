from celery import shared_task
from django.utils import timezone
from .models import Exposicao, Evento
from .events import emit_event


@shared_task
def encerrar_exposicoes():
    agora = timezone.now()

    exposicoes = Exposicao.objects.filter(
        data_fim__lt=agora,
        estado__in=['Reservado', 'Esgotado']
    )

    for expo in exposicoes:
        expo.estado = 'encerrado'
        expo.save()

        emit_event("exposicao_encerrada", {
            "exposicao_id": expo.id
        })

    return f"{exposicoes.count()} encerradas."


@shared_task
def encerrar_eventos():
    agora = timezone.now()

    eventos = Evento.objects.filter(
        data_fim__lt=agora,
        estado__in=['Reservado', 'Esgotado']
    )

    for ev in eventos:
        ev.estado = 'encerrado'
        ev.save()

        emit_event("evento_encerrado", {
            "evento_id": ev.id
        })

    return f"{eventos.count()} encerradas."


@shared_task
def atualizar_estados():
    exposicoes = Exposicao.objects.all()
    eventos = Evento.objects.all()

    for expo in exposicoes:
        expo.atualizar_estado()
        expo.save()

    for ev in eventos:
        ev.atualizar_estado()
        ev.save()

        