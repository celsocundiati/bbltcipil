from rest_framework.exceptions import ValidationError
from administracao.models import ConfiguracaoSistema, Multa
from livros.models import Emprestimo


def validar_criacao_emprestimo(usuario):

    config = ConfiguracaoSistema.objects.first()

    ativos = Emprestimo.objects.filter(
        reserva__usuario=usuario,
        acoes__in=["ativo", "atrasado"]
    ).count()

    if ativos >= config.limite_livros_estudante:
        raise ValidationError("Limite de livros em uso atingido.")
    
    total_multas = Multa.objects.filter(
        usuario=usuario,
        estado=["Pendente"]
        ).count()

    if total_multas:
        raise ValidationError({
            # "erro": "multa_ativa",
            f"{usuario.first_name} Possui {total_multas} multa, impossível solicitar reserva!"
            # "acao": "Resolva sobre seus empréstimos atrasados na biblioteca."
        })

    return True


def validar_devolucao(emprestimo):

    if emprestimo.acoes == "devolvido":
        raise ValidationError("Este empréstimo já foi devolvido.")

    return True

