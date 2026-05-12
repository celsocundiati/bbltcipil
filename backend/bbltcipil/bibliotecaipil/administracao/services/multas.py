from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
# from livros.models import Livro, Emprestimo
from administracao.models import Multa
from bibliotecaipil.events import emit_event
from administracao.services.emprestimos import devolver_emprestimo
from .config import get_config, multas_ativas
from decimal import Decimal
from django.utils import timezone



def calcular_valor_multa(emprestimo, motivo):

    config = get_config()
    hoje = timezone.now().date()

    if not emprestimo or not emprestimo.data_devolucao:
        return 0

    prazo = emprestimo.data_devolucao

    if motivo == "Atraso":
        if hoje > prazo:
            return (hoje - prazo).days * config.multa_por_dia

    if motivo == "Dano":
        return config.multa_por_dano

    if motivo == "Perda":
        return config.multa_por_perda

    return 0


# def criar_multa(*, emprestimo, motivo, user):
#     config = get_config()

#     # 1. verificar se cobrança está ativa
#     if not multas_ativas():
#         raise ValidationError(
#             "A cobrança de multas está desativada pelo sistema."
#         )


#     if not emprestimo:
#         raise ValidationError("Empréstimo é obrigatório.")

#     if motivo in ["Dano", "Perda"] and Multa.objects.filter(
#         emprestimo=emprestimo,
#         motivo=motivo
#     ).exists():
#         raise ValidationError("Multa duplicada.")

#     total = Multa.objects.filter(
#         emprestimo=emprestimo
#     ).exclude(motivo="Atraso").count()

#     if total >= 2:
#         raise ValidationError("Limite de multas atingido.")

#     valor = calcular_valor_multa(emprestimo, motivo)

#     multa = Multa.objects.create(
#         emprestimo=emprestimo,
#         motivo=motivo,
#         valor=valor,
#         criado_por=user
#     )

#     # ✅ EVENTO CERTO AQUI
#     emit_event("multa_criada", {
#         "multa_id": multa.id
#     })

#     return multa


def criar_multa(*, emprestimo, motivo, user):

    # 1. verificar se cobrança está ativa
    if not multas_ativas():
        raise ValidationError(
            "A cobrança de multas está desativada pelo sistema."
        )

    if not emprestimo:
        raise ValidationError("Empréstimo é obrigatório.")

    if motivo in ["Dano", "Perda"] and Multa.objects.filter(
        emprestimo=emprestimo,
        motivo=motivo
    ).exists():
        raise ValidationError("Multa duplicada.")

    total = Multa.objects.filter(
        emprestimo=emprestimo
    ).exclude(motivo="Atraso").count()

    if total >= 2:
        raise ValidationError("Limite de multas atingido.")

    valor = calcular_valor_multa(emprestimo, motivo)

    multa = Multa.objects.create(
        emprestimo=emprestimo,
        motivo=motivo,
        valor=valor,
        criado_por=user
    )

    emit_event("multa_criada", {
        "multa_id": multa.id
    })

    return multa


def pagar_multa(*, multa):

    if not multas_ativas():
        raise ValidationError(
            "A cobrança de multas está desativada pelo sistema."
        )

    with transaction.atomic():

        if multa.estado == "Pago":
            raise ValidationError("Já paga.")

        multa.marcar_como_pago()

    emit_event("multa_paga", {
        "multa_id": multa.id
    })

    return multa


def dispensar_multa(*, multa):
    
    # 1. verificar se cobrança está ativa
    if not multas_ativas():
        raise ValidationError(
            "A cobrança de multas está desativada pelo sistema."
        )

    with transaction.atomic():

        if multa.estado == "Pago":
            raise ValidationError("Não pode dispensar paga.")

        multa.dispensar()
        devolver_emprestimo(multa.emprestimo)

    emit_event("multa_dispensada", {
        "multa_id": multa.id
    })

    return multa

