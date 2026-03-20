from celery import shared_task
from django.utils import timezone
from django.db import transaction

from .models import Multa
from livros.models import Emprestimo
from .audit_service import AuditService


@shared_task
def gerar_multas_atraso():
    hoje = timezone.now().date()

    emprestimos = Emprestimo.objects.filter(
        data_devolucao__lt=hoje,
        acoes__in=["ativo", "atrasado"]
    ).select_related("reserva", "reserva__usuario")

    novas_multas = 0
    multas_atualizadas = 0

    for emprestimo in emprestimos:
        dias_atraso = (hoje - emprestimo.data_devolucao).days
        valor_calculado = dias_atraso * 500

        with transaction.atomic():

            multa, created = Multa.objects.get_or_create(
                emprestimo=emprestimo,
                motivo="Atraso",
                defaults={
                    "valor": valor_calculado,
                    "criado_por": None
                }
            )

            # 🔥 CASO NOVA MULTA
            if created:
                novas_multas += 1

                AuditService.log(
                    user=None,
                    action="MULTA_ATRASO_CRIADA",
                    instance=multa,
                    extra={
                        "dias_atraso": dias_atraso,
                        "valor": float(valor_calculado),
                        "emprestimo_id": emprestimo.id
                    }
                )

            # 🔥 CASO MULTA JÁ EXISTE → ATUALIZA VALOR
            else:
                if multa.valor != valor_calculado:
                    valor_antigo = multa.valor
                    multa.valor = valor_calculado
                    multa.save()

                    multas_atualizadas += 1

                    AuditService.log(
                        user=None,
                        action="MULTA_ATRASO_ATUALIZADA",
                        instance=multa,
                        extra={
                            "valor_antigo": float(valor_antigo),
                            "valor_novo": float(valor_calculado),
                            "dias_atraso": dias_atraso
                        }
                    )

    return {
        "novas_multas": novas_multas,
        "multas_atualizadas": multas_atualizadas
    }

