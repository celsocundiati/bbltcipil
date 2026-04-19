from django.utils import timezone
from rest_framework.exceptions import ValidationError
from administracao.models import ConfiguracaoSistema
from livros.models import Reserva


def validar_criacao_reserva(usuario):

    config = ConfiguracaoSistema.objects.first()
    if not config:
        raise ValidationError("Configuração do sistema não definida.")

    # 🔥 1. Reservas ativas (inclui reservadas + em uso + pendentes)
    reservas_ativas = Reserva.objects.filter(
        usuario=usuario
    ).exclude(
        estado__in=["finalizada", "expirada"]
    ).count()

    if reservas_ativas >= config.limite_reservas_ativas:
        raise ValidationError("Limite de reservas ativas atingido.")

    # 🔥 2. Reservas em uso (IMPORTANTE)
    reservas_em_uso = Reserva.objects.filter(
        usuario=usuario,
        estado="em_uso"
    ).count()

    if reservas_em_uso >= config.limite_reservas_uso:
        raise ValidationError("Limite de reservas em uso atingido.")

    # 🔥 3. Reservas do mês (CORRETO agora)
    hoje = timezone.now()
    inicio_mes = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    reservas_mes = Reserva.objects.filter(
        usuario=usuario,
        data_reserva__gte=inicio_mes
    ).count()

    if reservas_mes >= config.limite_reservas_mensal:
        raise ValidationError("Limite mensal de reservas atingido.")

    return True


def validar_aprovar_reserva(reserva):
    if reserva.estado != "reservado":
        raise ValidationError("Apenas reservas 'reservado' podem ser aprovadas.")
    return True


def validar_finalizar_reserva(reserva):
    if reserva.estado != "em_uso":
        raise ValidationError("Apenas reservas 'em_uso' podem ser finalizadas.")
    return True



