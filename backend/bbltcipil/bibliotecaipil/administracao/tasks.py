# from celery import shared_task
# from django.utils import timezone
# from django.db import transaction
# from datetime import timedelta
# from bibliotecaipil.events import emit_event
# from livros.models import Reserva, Livro, Emprestimo
# from .models import Multa
# from .service import calcular_valor_multa
# from audit.utils import set_system_user


# @shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
# def gerar_multas_atraso(self):
#     set_system_user()
#     print("🔥 [MULTAS] TASK INICIADA")

#     hoje = timezone.now().date()

#     emprestimos = Emprestimo.objects.filter(
#         data_devolucao__lt=hoje,
#         acoes__in=["ativo", "atrasado"]
#     ).select_related("reserva", "livro")

#     novas = 0
#     atualizadas = 0

#     for e in emprestimos:
#         try:
#             valor = calcular_valor_multa(e, "Atraso")

#             with transaction.atomic():
#                 multa, created = Multa.objects.get_or_create(
#                     emprestimo=e,
#                     motivo="Atraso",
#                     defaults={"valor": valor}
#                 )

#                 if created:
#                     novas += 1

#                 elif multa.valor != valor:
#                     multa.valor = valor
#                     multa.save(update_fields=["valor"])
#                     atualizadas += 1

#         except Exception as e:
#             print(f"❌ Erro multa empréstimo {e.id}: {e}")

#     return {"novas": novas, "atualizadas": atualizadas}



# @shared_task(bind=True)
# def atualizar_emprestimos_atrasados(self):
#     set_system_user()
#     print("📚 [EMPRÉSTIMOS] TASK INICIADA")

#     hoje = timezone.now().date()

#     emprestimos = Emprestimo.objects.filter(
#         acoes="ativo",
#         data_devolucao__lt=hoje
#     )

#     atualizados = 0

#     for e in emprestimos:
#         try:
#             e.acoes = "atrasado"
#             e.save(update_fields=["acoes"])  # 🔥 DISPARA SIGNAL
#             atualizados += 1
#             emit_event("emprestimo_atrasado", {"emprestimo_id": e.id})  # 🔥 dispara event para multa + log + notificações
#         except Exception as err:
#             print(f"❌ Erro empréstimo {e.id}: {err}")

#     return {"atualizados": atualizados}



# @shared_task(bind=True)
# def aprovar_reservas_automaticamente(self):
#     set_system_user()
#     print("🚀 [APROVAÇÃO] TASK INICIADA")

#     reservas = Reserva.objects.filter(
#         estado="pendente"
#     ).select_related("livro", "usuario").order_by("data_reserva")

#     aprovadas = 0

#     for r in reservas:
#         try:
#             with transaction.atomic():
#                 livro = Livro.objects.select_for_update().get(id=r.livro.id)

#                 if livro.quantidade <= 0:
#                     continue

#                 r.estado = "reservado"
#                 r.data_aprovacao = timezone.now()
#                 r.save(update_fields=["estado", "data_aprovacao"])
#                 aprovadas += 1
#                 # Quando a reserva é aprovada
#                 emit_event("reserva_aprovada", {"reserva_id": livro.reserva.id})

#         except Exception as e:
#             print(f"❌ Erro reserva {r.id}: {e}")

#     return {"aprovadas": aprovadas}


# @shared_task(bind=True)
# def expirar_reservas(self):
#     set_system_user()
#     print("⏳ [EXPIRAÇÃO] TASK INICIADA")

#     limite = timezone.now() - timedelta(days=3)

#     reservas = Reserva.objects.filter(
#         estado="reservado",
#         data_aprovacao__lt=limite
#     )

#     expiradas = 0

#     for r in reservas:
#         try:
#             with transaction.atomic():
#                 r.estado = "expirada"
#                 r.save(update_fields=["estado"])
#                 expiradas += 1
#         except Exception as e:
#             print(f"❌ Erro expiração {r.id}: {e}")

#     if expiradas > 0:
#         aprovar_reservas_automaticamente.delay()

#     return {"expiradas": expiradas}



# @shared_task(bind=True)
# def rotina_automatica_sistema(self):
#     set_system_user()
#     print("🧠 [ORQUESTRADOR] INICIADO")

#     gerar_multas_atraso.delay()
#     atualizar_emprestimos_atrasados.delay()
#     expirar_reservas.delay()
#     aprovar_reservas_automaticamente.delay()

#     print("✅ [ORQUESTRADOR] Tasks disparadas")

#     return {"status": "ok"}







# # @shared_task
# # def minha_task():
# #     set_system_user()

# #     # resto da lógica

# # # =============================
# # # MULTAS
# # # =============================
# # @shared_task
# # def gerar_multas_atraso():
# #     print("🔥 [MULTAS] TASK INICIADA")

# #     hoje = timezone.now().date()

# #     emprestimos = Emprestimo.objects.filter(
# #         data_devolucao__lt=hoje,
# #         acoes__in=["ativo", "atrasado"]
# #     )

# #     print(f"📊 [MULTAS] Encontrados: {emprestimos.count()}")

# #     novas = 0
# #     atualizadas = 0

# #     for e in emprestimos:
# #         valor = calcular_valor_multa(e, "Atraso")

# #         with transaction.atomic():
# #             multa, created = Multa.objects.get_or_create(
# #                 emprestimo=e,
# #                 motivo="Atraso",
# #                 defaults={"valor": valor}
# #             )

# #             if created:
# #                 print(f"✅ [MULTAS] Criada multa para empréstimo {e.id}")
# #                 novas += 1

# #             elif multa.valor != valor:
# #                 multa.valor = valor
# #                 multa.save(update_fields=["valor"])
# #                 print(f"🔄 [MULTAS] Atualizada multa {e.id}")
# #                 atualizadas += 1

# #     print(f"📦 [MULTAS] Resultado: novas={novas}, atualizadas={atualizadas}")

# #     return {"novas": novas, "atualizadas": atualizadas}


# # # =============================
# # # APROVAÇÃO AUTOMÁTICA
# # # =============================
# # @shared_task
# # def aprovar_reservas_automaticamente():
# #     print("🚀 [APROVAÇÃO] TASK INICIADA")

# #     reservas = Reserva.objects.filter(
# #         estado="pendente"
# #     ).select_related("livro", "usuario").order_by("data_reserva")

# #     print(f"📊 [APROVAÇÃO] Pendentes: {reservas.count()}")

# #     aprovadas = 0

# #     for r in reservas:
# #         with transaction.atomic():

# #             livro = Livro.objects.select_for_update().get(id=r.livro.id)

# #             if livro.quantidade <= 0:
# #                 print(f"⚠️ [APROVAÇÃO] Sem stock livro {livro.id}")
# #                 continue

# #             r.estado = "reservado"
# #             r.data_aprovacao = timezone.now()
# #             r.save(update_fields=["estado", "data_aprovacao"])

# #             aprovadas += 1
# #             print(f"✅ [APROVAÇÃO] Reserva {r.id} aprovada")

# #     print(f"📦 [APROVAÇÃO] Total aprovadas: {aprovadas}")

# #     return {"aprovadas": aprovadas}


# # # =============================
# # # EXPIRAÇÃO
# # # =============================
# # @shared_task
# # def expirar_reservas():
# #     print("⏳ [EXPIRAÇÃO] TASK INICIADA")

# #     limite = timezone.now() - timedelta(days=3)

# #     reservas = Reserva.objects.filter(
# #         estado="reservado",
# #         data_aprovacao__lt=limite
# #     )

# #     print(f"📊 [EXPIRAÇÃO] Para expirar: {reservas.count()}")

# #     expiradas = 0

# #     for r in reservas:
# #         with transaction.atomic():

# #             r.estado = "expirada"
# #             r.save(update_fields=["estado"])

# #             expiradas += 1
# #             print(f"❌ [EXPIRAÇÃO] Reserva {r.id} expirada")

# #     if expiradas > 0:
# #         print("🔁 [EXPIRAÇÃO] Chamando aprovação automática")
# #         aprovar_reservas_automaticamente.delay()

# #     print(f"📦 [EXPIRAÇÃO] Total expiradas: {expiradas}")

# #     return {"expiradas": expiradas}


# # # =============================
# # # ATUALIZAÇÃO DE EMPRÉSTIMOS
# # # =============================
# # @shared_task
# # def atualizar_emprestimos_atrasados():
# #     print("📚 [EMPRÉSTIMOS] TASK INICIADA")

# #     hoje = timezone.now().date()

# #     atualizados = Emprestimo.objects.filter(
# #         acoes="ativo",
# #         data_devolucao__lt=hoje
# #     ).update(acoes="atrasado")

# #     print(f"🔄 [EMPRÉSTIMOS] Atualizados para atrasado: {atualizados}")

# #     return {"atualizados": atualizados}


# # # =============================
# # # ORQUESTRADOR
# # # =============================
# # @shared_task
# # def rotina_automatica_sistema():
# #     print("🧠 [ORQUESTRADOR] INICIADO")

# #     gerar_multas_atraso.delay()
# #     expirar_reservas.delay()
# #     aprovar_reservas_automaticamente.delay()
# #     atualizar_emprestimos_atrasados.delay()
# #     minha_task.delay()

# #     print("✅ [ORQUESTRADOR] Tasks disparadas")

# #     return {"status": "ok"}



# administracao/tasks.py
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from datetime import timedelta
from bibliotecaipil.events import emit_event
from livros.models import Emprestimo, Reserva
from .models import Multa
from .service import calcular_valor_multa
from audit.utils import set_system_user

# ===============================
# TASK → GERA MULTAS ATRASO
# ===============================
@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def gerar_multas_atraso(self):
    set_system_user()
    hoje = timezone.now().date()
    emprestimos = Emprestimo.objects.filter(
        data_devolucao__lt=hoje,
        acoes__in=["ativo", "atrasado"]
    ).select_related("reserva", "reserva__livro")

    novas = 0
    atualizadas = 0

    for e in emprestimos:
        try:
            valor = calcular_valor_multa(e, "Atraso")
            with transaction.atomic():
                multa, created = Multa.objects.get_or_create(
                    emprestimo=e,
                    motivo="Atraso",
                    defaults={"valor": valor}
                )

                if created:
                    novas += 1
                    # 🔥 Dispara evento para notificação
                    emit_event("multa_aplicada", {"multa_id": multa.id})

                elif multa.valor != valor:
                    multa.valor = valor
                    multa.save(update_fields=["valor"])
                    atualizadas += 1

        except Exception as err:
            print(f"❌ Erro multa empréstimo {e.id}: {err}")

    return {"novas": novas, "atualizadas": atualizadas}


# ===============================
# TASK → ATUALIZA EMPRÉSTIMOS ATRASADOS
# ===============================
@shared_task(bind=True)
def atualizar_emprestimos_atrasados(self):
    set_system_user()
    hoje = timezone.now().date()
    emprestimos = Emprestimo.objects.filter(
        acoes="ativo",
        data_devolucao__lt=hoje
    )

    atualizados = 0
    for e in emprestimos:
        try:
            e.acoes = "atrasado"
            e.save(update_fields=["acoes"])
            atualizados += 1
            # 🔥 Dispara evento → multa + log + notificações
            emit_event("emprestimo_atrasado", {"emprestimo_id": e.id})
        except Exception as err:
            print(f"❌ Erro empréstimo {e.id}: {err}")

    return {"atualizados": atualizados}


# ===============================
# TASK → APROVAR RESERVAS AUTOMÁTICAS
# ===============================
@shared_task(bind=True)
def aprovar_reservas_automaticamente(self):
    set_system_user()
    reservas = Reserva.objects.filter(
        estado="pendente"
    ).select_related("livro", "usuario").order_by("data_reserva")

    aprovadas = 0
    for r in reservas:
        try:
            with transaction.atomic():
                livro = r.livro
                # 🔒 Lock para evitar race conditions
                livro = livro.__class__.objects.select_for_update().get(id=livro.id)

                if livro.quantidade <= 0:
                    continue

                r.estado = "reservado"
                r.data_aprovacao = timezone.now()
                r.save(update_fields=["estado", "data_aprovacao"])
                aprovadas += 1

                # 🔥 Dispara evento → notificação
                emit_event("reserva_aprovada", {"reserva_id": r.id})

        except Exception as e:
            print(f"❌ Erro reserva {r.id}: {e}")

    return {"aprovadas": aprovadas}


# ===============================
# TASK → EXPIRAR RESERVAS
# ===============================
@shared_task(bind=True)
def expirar_reservas(self):
    set_system_user()
    limite = timezone.now() - timedelta(days=3)
    reservas = Reserva.objects.filter(
        estado="reservado",
        data_aprovacao__lt=limite
    )

    expiradas = 0
    for r in reservas:
        try:
            with transaction.atomic():
                r.estado = "expirada"
                r.save(update_fields=["estado"])
                expiradas += 1
        except Exception as e:
            print(f"❌ Erro expiração reserva {r.id}: {e}")

    if expiradas > 0:
        # 🔁 Chama aprovação automática para próximas reservas
        aprovar_reservas_automaticamente.delay()

    return {"expiradas": expiradas}


# ===============================
# TASK → ORQUESTRADOR CENTRAL
# ===============================
@shared_task(bind=True)
def rotina_automatica_sistema(self):
    set_system_user()
    print("🧠 [ORQUESTRADOR] INICIADO")

    gerar_multas_atraso.delay()
    atualizar_emprestimos_atrasados.delay()
    expirar_reservas.delay()
    aprovar_reservas_automaticamente.delay()

    print("✅ [ORQUESTRADOR] Tasks disparadas")
    return {"status": "ok"}





