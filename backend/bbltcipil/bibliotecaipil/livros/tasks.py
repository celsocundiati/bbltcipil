from celery import shared_task
from django.utils import timezone
from datetime import timedelta

from .models import Reserva, Emprestimo


@shared_task
def atualizar_emprestimos_atrasados():

    hoje = timezone.now().date()

    Emprestimo.objects.filter(
        acoes="ativo",
        data_devolucao__lt=hoje
    ).update(acoes="atrasado")


@shared_task
def expirar_reservas():

    limite = timezone.now() - timedelta(days=3)

    return Reserva.objects.filter(
        estado="reservado",
        data_aprovacao__lt=limite
    ).update(estado="expirada")