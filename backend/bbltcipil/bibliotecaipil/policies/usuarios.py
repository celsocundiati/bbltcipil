from rest_framework.exceptions import ValidationError
from livros.models import Reserva, Emprestimo


def validar_usuario_bloqueado(usuario):
    if getattr(usuario, "is_blocked", False):
        raise ValidationError("Utilizador bloqueado.")


def obter_estado_usuario(usuario):
    """
    Aqui podes evoluir depois para:
    - ativo
    - limitado
    - bloqueado
    - vip
    """

    emprestimos = Emprestimo.objects.filter(
        reserva__usuario=usuario,
        acoes__in=["ativo", "atrasado"]
    ).count()

    reservas = Reserva.objects.filter(usuario=usuario).count()

    return {
        "emprestimos_ativos": emprestimos,
        "reservas_total": reservas,
    }



