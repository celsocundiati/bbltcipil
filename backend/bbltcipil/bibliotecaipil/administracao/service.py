from django.utils import timezone
from django.db import transaction
from datetime import timedelta

from administracao.utils import get_config
from livros.models import Livro, Emprestimo
from administracao.models import ConfiguracaoSistema



def criar_emprestimo(reserva, admin_user=None):

    usuario = reserva.usuario

    if reserva.estado != "reservado":
        raise Exception("A reserva precisa estar 'reservado'.")

    config = ConfiguracaoSistema.objects.first()

    if not config:
        raise Exception("Configuração do sistema não definida")

    emprestimos_ativos = Emprestimo.objects.filter(
        reserva__usuario=usuario,
        acoes__in=["ativo", "atrasado"]
    ).count()

    if emprestimos_ativos >= config.limite_livros_estudante:
        raise Exception(
            f"Limite de {config.limite_livros_estudante} empréstimos atingido"
        )

    with transaction.atomic():

        data_devolucao = timezone.now().date() + timedelta(days=config.dias_emprestimo)

        emprestimo = Emprestimo.objects.create(
            reserva=reserva,
            data_devolucao=data_devolucao,
            acoes="ativo"
        )

        # 🔥 atualiza estado da reserva
        reserva.estado = "aprovada"
        reserva.aprovada_por = admin_user
        reserva.save(update_fields=["estado", "aprovada_por"])

    return emprestimo


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


def atualizar_emprestimos_atrasados():

    hoje = timezone.now().date()

    return Emprestimo.objects.filter(
        acoes="ativo",
        data_devolucao__lt=hoje
    ).update(acoes="atrasado")


def devolver_emprestimo(emprestimo):

    with transaction.atomic():

        if emprestimo.acoes == "devolvido":
            return

        emprestimo.acoes = "devolvido"
        emprestimo.save(update_fields=["acoes"])

        # 🔒 LOCK REAL
        livro = Livro.objects.select_for_update().get(
            id=emprestimo.reserva.livro.id
        )

        livro.quantidade += 1
        livro.save(update_fields=["quantidade"])

        reserva = emprestimo.reserva
        reserva.estado = "finalizada"
        reserva.save(update_fields=["estado"])

        atualizar_perfil(reserva.usuario)


def atualizar_perfil(usuario):

    perfil = getattr(usuario, "perfil", None)

    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()






