from celery import shared_task
from django.utils import timezone
from django.db import transaction
from datetime import timedelta

from livros.models import Reserva, Livro, Emprestimo
from .models import Multa
from .service import calcular_valor_multa
from audit.utils import set_system_user

@shared_task
def minha_task():
    set_system_user()

    # resto da lógica

# =============================
# MULTAS
# =============================
@shared_task
def gerar_multas_atraso():
    print("🔥 [MULTAS] TASK INICIADA")

    hoje = timezone.now().date()

    emprestimos = Emprestimo.objects.filter(
        data_devolucao__lt=hoje,
        acoes__in=["ativo", "atrasado"]
    )

    print(f"📊 [MULTAS] Encontrados: {emprestimos.count()}")

    novas = 0
    atualizadas = 0

    for e in emprestimos:
        valor = calcular_valor_multa(e, "Atraso")

        with transaction.atomic():
            multa, created = Multa.objects.get_or_create(
                emprestimo=e,
                motivo="Atraso",
                defaults={"valor": valor}
            )

            if created:
                print(f"✅ [MULTAS] Criada multa para empréstimo {e.id}")
                novas += 1

            elif multa.valor != valor:
                multa.valor = valor
                multa.save(update_fields=["valor"])
                print(f"🔄 [MULTAS] Atualizada multa {e.id}")
                atualizadas += 1

    print(f"📦 [MULTAS] Resultado: novas={novas}, atualizadas={atualizadas}")

    return {"novas": novas, "atualizadas": atualizadas}


# =============================
# APROVAÇÃO AUTOMÁTICA
# =============================
@shared_task
def aprovar_reservas_automaticamente():
    print("🚀 [APROVAÇÃO] TASK INICIADA")

    reservas = Reserva.objects.filter(
        estado="pendente"
    ).select_related("livro", "usuario").order_by("data_reserva")

    print(f"📊 [APROVAÇÃO] Pendentes: {reservas.count()}")

    aprovadas = 0

    for r in reservas:
        with transaction.atomic():

            livro = Livro.objects.select_for_update().get(id=r.livro.id)

            if livro.quantidade <= 0:
                print(f"⚠️ [APROVAÇÃO] Sem stock livro {livro.id}")
                continue

            r.estado = "reservado"
            r.data_aprovacao = timezone.now()
            r.save(update_fields=["estado", "data_aprovacao"])

            aprovadas += 1
            print(f"✅ [APROVAÇÃO] Reserva {r.id} aprovada")

    print(f"📦 [APROVAÇÃO] Total aprovadas: {aprovadas}")

    return {"aprovadas": aprovadas}


# =============================
# EXPIRAÇÃO
# =============================
@shared_task
def expirar_reservas():
    print("⏳ [EXPIRAÇÃO] TASK INICIADA")

    limite = timezone.now() - timedelta(days=3)

    reservas = Reserva.objects.filter(
        estado="reservado",
        data_aprovacao__lt=limite
    )

    print(f"📊 [EXPIRAÇÃO] Para expirar: {reservas.count()}")

    expiradas = 0

    for r in reservas:
        with transaction.atomic():

            r.estado = "expirada"
            r.save(update_fields=["estado"])

            expiradas += 1
            print(f"❌ [EXPIRAÇÃO] Reserva {r.id} expirada")

    if expiradas > 0:
        print("🔁 [EXPIRAÇÃO] Chamando aprovação automática")
        aprovar_reservas_automaticamente.delay()

    print(f"📦 [EXPIRAÇÃO] Total expiradas: {expiradas}")

    return {"expiradas": expiradas}


# =============================
# ATUALIZAÇÃO DE EMPRÉSTIMOS
# =============================
@shared_task
def atualizar_emprestimos_atrasados():
    print("📚 [EMPRÉSTIMOS] TASK INICIADA")

    hoje = timezone.now().date()

    atualizados = Emprestimo.objects.filter(
        acoes="ativo",
        data_devolucao__lt=hoje
    ).update(acoes="atrasado")

    print(f"🔄 [EMPRÉSTIMOS] Atualizados para atrasado: {atualizados}")

    return {"atualizados": atualizados}


# =============================
# ORQUESTRADOR
# =============================
@shared_task
def rotina_automatica_sistema():
    print("🧠 [ORQUESTRADOR] INICIADO")

    gerar_multas_atraso.delay()
    expirar_reservas.delay()
    aprovar_reservas_automaticamente.delay()
    atualizar_emprestimos_atrasados.delay()
    minha_task.delay()

    print("✅ [ORQUESTRADOR] Tasks disparadas")

    return {"status": "ok"}



