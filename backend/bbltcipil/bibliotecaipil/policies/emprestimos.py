from rest_framework.exceptions import ValidationError
from administracao.models import ConfiguracaoSistema
from livros.models import Emprestimo


def validar_criacao_emprestimo(usuario):

    config = ConfiguracaoSistema.objects.first()

    ativos = Emprestimo.objects.filter(
        reserva__usuario=usuario,
        acoes__in=["ativo", "atrasado"]
    ).count()

    if ativos >= config.limite_livros_estudante:
        raise ValidationError("Limite de livros em uso atingido.")

    return True


def validar_devolucao(emprestimo):

    if emprestimo.acoes == "devolvido":
        raise ValidationError("Este empréstimo já foi devolvido.")

    return True
