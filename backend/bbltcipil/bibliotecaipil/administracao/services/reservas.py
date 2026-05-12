from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from livros.models import Emprestimo
from policies.reservas import validar_aprovar_reserva, validar_finalizar_reserva
from bibliotecaipil.events import emit_event


def aprovar_reserva(reserva, admin_user):

    validar_aprovar_reserva(reserva)

    with transaction.atomic():
        reserva.estado = "em_uso"
        reserva.aprovada_por = admin_user
        reserva.save(update_fields=["estado", "aprovada_por"])

    emit_event("reserva_em_uso", {"reserva_id": reserva.id})


def finalizar_reserva(reserva):

    validar_finalizar_reserva(reserva)

    with transaction.atomic():
        reserva.estado = "finalizada"
        reserva.save(update_fields=["estado"])

    emit_event("reserva_finalizada", {"reserva_id": reserva.id})


def cancelar_reserva_admin(reserva, admin_user):

    if reserva.estado not in ["pendente", "reservado"]:
        raise ValidationError("Só é possível cancelar reservas ativas.")

    with transaction.atomic():
        reserva.estado = "expirada"
        reserva.save(update_fields=["estado"])

    emit_event("reserva_cancelada", {"reserva_id": reserva.id})


def remover_reserva(reserva, admin_user):

    if reserva.estado not in ["pendente", "reservado"]:
        raise ValidationError("Só pode remover reservas não processadas.")

    reserva_id = reserva.id

    with transaction.atomic():
        reserva.delete()

    emit_event("reserva_cancelada", {"reserva_id": reserva_id})

    