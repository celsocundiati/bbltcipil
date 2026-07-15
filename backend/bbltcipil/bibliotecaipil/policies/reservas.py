from django.utils import timezone
from rest_framework.exceptions import ValidationError
from administracao.models import ConfiguracaoSistema
from livros.models import Reserva, Emprestimo
from administracao.models import Multa


def validar_criacao_reserva(usuario):

    config = ConfiguracaoSistema.objects.first()
    if not config:
        raise ValidationError({
            "erro": "sistema_sem_config",
            "mensagem": "O sistema ainda não está configurado corretamente."
        })

    total_multas = Multa.objects.filter(
        usuario=usuario,
        estado=["Pendente"]
        ).count()

    if total_multas:
        raise ValidationError({
            "erro": "multa_ativa",
            "mensagem": f"Possui {total_multas} multa, impossível solicitar reserva!",
            "acao": "Resolva sobre seus empréstimos atrasados na biblioteca."
        })

    # =========================
    # RESERVAS ATIVAS
    # =========================
    reservas_ativas = Reserva.objects.filter(
        usuario=usuario
    ).exclude(
        estado__in=["finalizada", "expirada"]
    ).count()

    
    emprestimos_ativos = Emprestimo.objects.filter(
        reserva__usuario=usuario,
        acoes__in=["ativo", "atrasado"]
    ).count()

    livros_solicitados = reservas_ativas + emprestimos_ativos

    if livros_solicitados >= config.limite_reservas_ativas:
        raise ValidationError({
            "erro": "limite_reservas_ativas",
            "mensagem": "Limite de reservas ativas atingido.",
            "detalhe": f"Você já possui {reservas_ativas} reservas ativas e {emprestimos_ativos} empréstimos. O limite é {config.limite_reservas_ativas}.",
            "acao": "Finalize ou cancele reservas antigas para continuar."
        })

    # =========================
    # RESERVAS EM USO
    # =========================
    reservas_em_uso = Reserva.objects.filter(
        usuario=usuario,
        estado="em_uso"
    ).count()

    if reservas_em_uso >= config.limite_reservas_uso:
        raise ValidationError({
            "erro": "limite_reservas_uso",
            "mensagem": "Limite de livros em uso atingido.",
            "detalhe": f"Você já está com {reservas_em_uso} livro(s) em uso.",
            "acao": "Devolva livros para liberar novas reservas."
        })

    # =========================
    # RESERVAS DO MÊS
    # =========================
    hoje = timezone.now()
    inicio_mes = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    reservas_mes = Reserva.objects.filter(
        usuario=usuario,
        data_reserva__gte=inicio_mes
    ).count()

    if reservas_mes >= config.limite_reservas_mensal:
        raise ValidationError({
            "erro": "limite_reservas_mensal",
            "mensagem": "Limite mensal de reservas atingido.",
            "detalhe": f"Você já fez {reservas_mes} reservas este mês.",
            "acao": "Tente novamente no próximo mês."
        })

    return True


def validar_aprovar_reserva(reserva):
    if reserva.estado != "reservado":
        raise ValidationError("Apenas reservas 'reservado' podem ser aprovadas.")
    
    total_multas = Multa.objects.filter(
        usuario=reserva.usuario,
        estado=["Pendente"]
        ).count()

    if total_multas:
        raise ValidationError({
            "erro": "multa_ativa",
            "mensagem": f"Possui {total_multas} multa, impossível solicitar reserva!",
            "acao": "Resolva sobre seus empréstimos atrasados na biblioteca."
        })

    return True


def validar_finalizar_reserva(reserva):
    if reserva.estado != "em_uso":
        raise ValidationError("Apenas reservas 'em_uso' podem ser finalizadas.")
    return True




