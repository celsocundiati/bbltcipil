from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError

from livros.models import Livro, Emprestimo
from policies.emprestimos import validar_criacao_emprestimo
from bibliotecaipil.events import emit_event
from .config import get_config


def criar_emprestimo(reserva, admin_user=None):

    if reserva.estado != "reservado":
        raise Exception("A reserva precisa estar 'reservado'.")

    validar_criacao_emprestimo(reserva.usuario)

    config = get_config()

    with transaction.atomic():

        data_devolucao = timezone.now().date() + timedelta(days=config.dias_emprestimo)

        emprestimo = Emprestimo.objects.create(
            reserva=reserva,
            data_devolucao=data_devolucao,
            acoes="ativo"
        )

        reserva.estado = "finalizada"
        reserva.aprovada_por = admin_user
        reserva.save(update_fields=["estado", "aprovada_por"])

    emit_event("emprestimo_criado", {"emprestimo_id": emprestimo.id})

    return emprestimo


def devolver_emprestimo(emprestimo):

    with transaction.atomic():

        if emprestimo.acoes == "devolvido":
            raise ValidationError("Já devolvido.")

        livro = Livro.objects.select_for_update().get(
            id=emprestimo.reserva.livro.id
        )

        livro.quantidade += 1
        livro.save(update_fields=["quantidade"])

        Emprestimo.objects.filter(id=emprestimo.id).update(
            acoes="devolvido"
        )

    emit_event("emprestimo_devolvido", {"emprestimo_id": emprestimo.id})


    