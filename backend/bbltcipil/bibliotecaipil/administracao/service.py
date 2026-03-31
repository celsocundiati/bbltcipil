from django.utils import timezone
from django.db import transaction
from datetime import timedelta
from rest_framework.exceptions import ValidationError
from administracao.utils import get_config
from livros.models import Livro, Emprestimo
from administracao.models import ConfiguracaoSistema
from bibliotecaipil.events import emit_event


def criar_emprestimo(reserva, admin_user=None):

    if reserva.estado != "reservado":
        raise Exception("A reserva precisa estar 'reservado'.")

    config = ConfiguracaoSistema.objects.first()
    if not config:
        raise Exception("Configuração do sistema não definida")

    emprestimos_ativos = Emprestimo.objects.filter(
        reserva__usuario=reserva.usuario,
        acoes__in=["ativo", "atrasado"]
    ).count()

    if emprestimos_ativos >= config.limite_livros_estudante:
        raise Exception("Limite de empréstimos atingido")

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

    if reserva.estado != "reservado":
        raise ValidationError("Apenas reservas 'reservado' podem ser aprovadas.")

    with transaction.atomic():
        reserva.estado = "em_uso"
        reserva.aprovada_por = admin_user
        reserva.save(update_fields=["estado", "aprovada_por"])

    emit_event("reserva_aprovada", {
        "reserva_id": reserva.id
    })


def finalizar_reserva(reserva):

    if reserva.estado != "em_uso":
        raise ValidationError("Apenas reservas 'em_uso' podem ser finalizadas.")

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


def remover_reserva(reserva, admin_user):

    if reserva.estado not in ["pendente", "reservado"]:
        raise ValidationError("Só pode remover reservas não processadas.")

    reserva_id = reserva.id

    with transaction.atomic():
        reserva.delete()
    
    emit_event("reserva_cancelada", {
        "reserva_id": reserva.id
    })


def devolver_emprestimo(emprestimo):

    with transaction.atomic():

        if emprestimo.acoes == "devolvido":
            raise ValidationError("Já devolvido.")

        livro = Livro.objects.select_for_update().get(id=emprestimo.reserva.livro.id)

        livro.quantidade += 1
        livro.save(update_fields=["quantidade"])

        emprestimo.acoes = "devolvido"
        emprestimo.save(update_fields=["acoes"])

    # 🔥 EVENTO CRÍTICO
    emit_event("emprestimo_devolvido", {
        "emprestimo_id": emprestimo.id
    })





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


def atualizar_perfil(usuario):

    perfil = getattr(usuario, "perfil", None)

    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()





