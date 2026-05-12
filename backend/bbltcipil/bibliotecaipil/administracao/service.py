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
    hoje = timezone.now().date()

    if not emprestimo or not emprestimo.data_devolucao:
        return 0

    prazo = emprestimo.data_devolucao

    if motivo == "Atraso":
        if hoje > prazo:
            dias_atraso = (hoje - prazo).days
            return dias_atraso * config.multa_por_dia

    elif motivo == "Dano":
        return config.multa_por_dano

    elif motivo == "Perda":
        return config.multa_por_perda

    return 0


# -----------------------------
# CRIAR MULTA
# -----------------------------
def criar_multa(*, emprestimo, motivo, user):

    if not emprestimo:
        raise ValidationError("Empréstimo é obrigatório.")

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

    multa = Multa.objects.create(
        emprestimo=emprestimo,
        motivo=motivo,
        valor=valor,
        criado_por=user
    )

    return multa


# -----------------------------
# PAGAR MULTA
# -----------------------------
def pagar_multa(*, multa):

    with transaction.atomic():

        if multa.estado == "Pago":
            raise ValidationError("Esta multa já foi paga.")

        multa.marcar_como_pago()

        devolver_emprestimo(multa.emprestimo)

    return multa


# -----------------------------
# DISPENSAR MULTA
# -----------------------------
def dispensar_multa(*, multa):

    with transaction.atomic():

        if multa.estado == "Pago":
            raise ValidationError("Não pode dispensar multa já paga.")

        multa.dispensar()

        devolver_emprestimo(multa.emprestimo)

    return multa



def atualizar_perfil(usuario):

    perfil = getattr(usuario, "perfil", None)

    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()





