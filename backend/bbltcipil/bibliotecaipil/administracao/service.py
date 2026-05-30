from django.utils import timezone
from django.db import transaction
from datetime import timedelta
from rest_framework.exceptions import ValidationError
from administracao.utils import get_config
from livros.models import Livro, Emprestimo
from .models import Multa
from administracao.models import ConfiguracaoSistema
from bibliotecaipil.events import emit_event
from policies.reservas import validar_aprovar_reserva, validar_finalizar_reserva
from policies.emprestimos import validar_criacao_emprestimo



def get_config():
    config = ConfiguracaoSistema.objects.first()
    if not config:
        raise Exception("Configuração do sistema não definida")
    return config


def criar_emprestimo(reserva, admin_user=None):

    if reserva.estado != "reservado":
        raise Exception("A reserva precisa estar 'reservado'.")

    # 🔥 NOVAS REGRAS
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

    # 🔥 EVENTO AQUI
    emit_event("emprestimo_criado", {
        "emprestimo_id": emprestimo.id
    })

    return emprestimo


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

    emit_event("reserva_finalizada", {
        "reserva_id": reserva.id
    })


def cancelar_reserva_admin(reserva, admin_user):

    if reserva.estado not in ["pendente", "reservado"]:
        raise ValidationError("Só é possível cancelar reservas ativas.")

    with transaction.atomic():
        reserva.estado = "expirada"
        reserva.save(update_fields=["estado"])

    emit_event("reserva_cancelada", {
        "reserva_id": reserva.id
    })


def remover_reserva(reserva, admin_user):

    if reserva.estado not in ["pendente", "reservado"]:
        raise ValidationError("Só pode remover reservas não processadas.")

    reserva_id = reserva.id

    with transaction.atomic():
        reserva.delete()
    
    emit_event("reserva_cancelada", {
        "reserva_id": reserva.id
    })


# -----------------------------
# DEVOLVER EMPRÉSTIMO
# -----------------------------
def devolver_emprestimo(emprestimo):

    with transaction.atomic():

        if emprestimo.acoes == "devolvido":
            raise ValidationError("Já devolvido.")

        livro = Livro.objects.select_for_update().get(
            id=emprestimo.reserva.livro.id
        )

        livro.quantidade += 1
        livro.save(update_fields=["quantidade"])

        Emprestimo.objects.filter(
            id=emprestimo.id
        ).update(
            acoes="devolvido"
        )

    emit_event("emprestimo_devolvido", {
        "emprestimo_id": emprestimo.id
    })


# -----------------------------
# CALCULAR MULTA
# -----------------------------
def calcular_valor_multa(emprestimo, motivo):

    config = get_config()

    if not config.cobranca_ativa:
        return 0

    hoje = timezone.now().date()

    if not emprestimo or not emprestimo.data_devolucao:
        return 0

    prazo = emprestimo.data_devolucao

    if motivo == "Atraso":

        dias_diff = (hoje - prazo).days

        if dias_diff < config.dias_tolerancia:
            return 0

        dias_atraso_valido = max(
            dias_diff - config.dias_tolerancia,
            0
        )

        return dias_atraso_valido * config.multa_por_dia

    elif motivo in ["Dano", "Perda"]:
        return config.multa_por_perda_ou_dano

    return 0


# -----------------------------
# CRIAR MULTA
# -----------------------------
def criar_multa(*, emprestimo, motivo, user):

    if not emprestimo:
        raise ValidationError("Empréstimo é obrigatório.")

    # 🔥 bloqueio global
    config = get_config()
    if not config.cobranca_ativa:
        raise ValidationError("Cobrança de multas está desativada no sistema.")

    if motivo in ["Dano", "Perda"] and Multa.objects.filter(
        emprestimo=emprestimo,
        motivo=motivo
    ).exists():
        raise ValidationError(
            f"Já existe multa de {motivo} para este empréstimo."
        )

    total_multas = Multa.objects.filter(
        emprestimo=emprestimo
    ).exclude(
        motivo="Atraso"
    ).count()

    if total_multas >= 2:
        raise ValidationError(
            "Este empréstimo já atingiu o limite de multas."
        )

    valor = calcular_valor_multa(emprestimo, motivo)

    if valor <= 0:
        raise ValidationError("Multa não aplicável (valor = 0).")

    with transaction.atomic():

        multa = Multa.objects.create(
            emprestimo=emprestimo,
            motivo=motivo,
            valor=valor,
            criado_por=user
        )

        # 🔥 EVENTO AQUI (FINALMENTE)
        emit_event("multa_criada", {
            "multa_id": multa.id
        })

    return multa


# -----------------------------
# PAGAR MULTA
# -----------------------------
def pagar_multa(*, multa):

    with transaction.atomic():

        if multa.estado == "Pago":
            raise ValidationError(
                "Esta multa já foi paga."
            )

        multa.marcar_como_pago()

        devolver_emprestimo(
            multa.emprestimo
        )

    transaction.on_commit(
        lambda: emit_event(
            "multa_paga",
            {
                "multa_id": multa.id
            }
        )
    )

    return multa


# -----------------------------
# DISPENSAR MULTA
# -----------------------------
def dispensar_multa(*, multa):

    with transaction.atomic():

        if multa.estado == "Pago":
            raise ValidationError(
                "Não pode dispensar multa já paga."
            )

        multa.dispensar()

        devolver_emprestimo(
            multa.emprestimo
        )

    transaction.on_commit(
        lambda: emit_event(
            "multa_dispensada",
            {
                "multa_id": multa.id
            }
        )
    )

    return multa


def atualizar_perfil(usuario):

    perfil = getattr(usuario, "perfil", None)

    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()





