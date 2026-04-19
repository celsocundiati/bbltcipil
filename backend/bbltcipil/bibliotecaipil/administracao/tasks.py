from celery import shared_task
from django.utils import timezone
from django.db import transaction
from datetime import timedelta

from livros.models import Reserva, Livro, Emprestimo
from .models import Multa
from .audit_service import AuditService
from .service import calcular_valor_multa



# =============================
# MULTAS
# =============================
@shared_task
def gerar_multas_atraso():

    hoje = timezone.now().date()

    emprestimos = Emprestimo.objects.filter(
        data_devolucao__lt=hoje,
        acoes__in=["ativo", "atrasado"]
    ).select_related("reserva", "reserva__usuario")

    novas = 0
    atualizadas = 0

    for e in emprestimos:

        valor = calcular_valor_multa(e, "Atraso")

        with transaction.atomic():

            multa, created = Multa.objects.get_or_create(
                emprestimo=e,
                motivo="Atraso",
                defaults={
                    "valor": valor,
                    "criado_por": None
                }
            )

            if created:
                novas += 1

                AuditService.log(
                    user=None,
                    action="MULTA_ATRASO_CRIADA",
                    instance=multa,
                    extra={
                        "valor": float(valor),
                        "emprestimo_id": e.id
                    }
                )

            elif multa.valor != valor:
                multa.valor = valor
                multa.save(update_fields=["valor"])
                atualizadas += 1

    return {"novas": novas, "atualizadas": atualizadas}


# =============================
# APROVAÇÃO
# =============================

@shared_task
def aprovar_reservas_automaticamente():
    reservas = Reserva.objects.filter(
        estado="pendente"
    ).select_related("livro", "usuario").order_by("data_reserva")

    aprovadas = 0

    for r in reservas:

        with transaction.atomic():

            livro = Livro.objects.select_for_update().get(id=r.livro.id)

            if livro.quantidade_disponivel <= 0:
                continue

            r.estado = "reservado"
            r.data_aprovacao = timezone.now()
            r.save(update_fields=["estado", "data_aprovacao"])

            aprovadas += 1

            AuditService.log(
                user=None,
                action="RESERVA_APROVADA_AUTOMATICAMENTE",
                instance=r,
                extra={
                    "livro_id": livro.id,
                    "usuario_id": r.usuario.first_name
                }
            )

    return {"aprovadas": aprovadas}


# =============================
# EXPIRAÇÃO
# =============================
@shared_task
def expirar_reservas():

    limite = timezone.now() - timedelta(days=3)

    reservas = Reserva.objects.filter(
        estado="reservado",
        data_aprovacao__lt=limite
    ).select_related("livro", "usuario")

    expiradas = 0

    for r in reservas:

        with transaction.atomic():

            r.estado = "expirada"
            r.save(update_fields=["estado"])

            expiradas += 1

            AuditService.log(
                user=None,
                action="RESERVA_EXPIRADA",
                instance=r,
                extra={
                    "usuario_id": r.usuario.first_name,
                    "livro_id": r.livro.id
                }
            )

    if expiradas > 0:
        aprovar_reservas_automaticamente.delay()

    return {"expiradas": expiradas}


# =============================
# ORQUESTRADOR
# =============================
@shared_task
def rotina_automatica_sistema():

    gerar_multas_atraso.delay()
    expirar_reservas.delay()
    aprovar_reservas_automaticamente.delay()

    return {"status": "ok"}



