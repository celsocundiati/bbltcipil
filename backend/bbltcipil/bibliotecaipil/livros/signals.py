# from django.db.models.signals import post_save, post_delete
# from django.dispatch import receiver
# from django.db.models import F
# from .models import Emprestimo, Reserva, Livro, Categoria, Notificacao
# from administracao.models import Multa

# # ===============================
# # FUNÇÃO AUXILIAR → ATUALIZA PERFIL
# # ===============================

# def atualizar_perfil(usuario):
#     """
#     Atualiza contadores e estado do perfil do usuário
#     """
#     perfil = None
#     # Criar reserva dummy apenas para acessar perfil_oficial
#     reserva_dummy = Reserva(usuario=usuario)
#     perfil = reserva_dummy.perfil_oficial

#     if perfil:
#         perfil.atualizar_contadores()
#         perfil.atualizar_estado()


# # ===============================
# # LIVRO → CONTADOR CATEGORIA
# # ===============================

# @receiver(post_save, sender=Livro)
# def atualizar_total_livro(sender, instance, created, **kwargs):
#     if created and instance.categoria:
#         Categoria.objects.filter(pk=instance.categoria.pk).update(
#             n_livros=F('n_livros') + 1
#         )


# @receiver(post_delete, sender=Livro)
# def reduzir_total_livro(sender, instance, **kwargs):
#     if instance.categoria:
#         Categoria.objects.filter(pk=instance.categoria.pk).update(
#             n_livros=F('n_livros') - 1
#         )


# # ===============================
# # LIVRO → CONTADOR AUTOR
# # ===============================

# @receiver(post_save, sender=Livro)
# def incrementar_total_obras(sender, instance, created, **kwargs):
#     if created and instance.autor:
#         type(instance.autor).objects.filter(pk=instance.autor.pk).update(
#             total_obras=F('total_obras') + 1
#         )


# @receiver(post_delete, sender=Livro)
# def decrementar_total_obras(sender, instance, **kwargs):
#     if instance.autor:
#         type(instance.autor).objects.filter(pk=instance.autor.pk).update(
#             total_obras=F('total_obras') - 1
#         )






# # ===============================
# # RESERVA → NOTIFICAÇÕES
# # ===============================

# @receiver(post_save, sender=Reserva)
# def notificar_reserva(sender, instance, created, **kwargs):
#     link = f"/reservas#reserva-{instance.id}"  
#     perfil = instance.perfil_oficial
#     usuario = perfil.user if perfil else instance.usuario

#     if created:
#         Notificacao.objects.create(
#             usuario=usuario,
#             titulo="Reserva solicitada",
#             descricao=f"Você solicitou a reserva do livro '{instance.livro.titulo}'.",
#             tipo="Reserva",
#             link=link
#         )
#     else:
#         if instance.estado == "em_uso":
#             Notificacao.objects.create(
#                 usuario=usuario,
#                 titulo="Reserva aprovada",
#                 descricao=f"Sua reserva do livro '{instance.livro.titulo}' foi aprovada e está em uso actualmentte.",
#                 tipo="Reserva",
#                 link=link
#             )
#         else:
#             if instance.estado == "finalizada":
#                 Notificacao.objects.create(
#                     usuario=usuario,
#                     titulo="Reserva concluída",
#                     descricao=f"Sua reserva do livro '{instance.livro.titulo}' foi finalizada.",
#                     tipo="Reserva",
#                     link=link
#                 )


# @receiver(post_delete, sender=Reserva)
# def notificar_cancelamento(sender, instance, **kwargs):
#     perfil = instance.perfil_oficial
#     usuario = perfil.user if perfil else instance.usuario

#     Notificacao.objects.create(
#         usuario=usuario,
#         titulo="Reserva cancelada",
#         descricao=f"A reserva do livro '{instance.livro.titulo}' foi cancelada.",
#         tipo="Reserva",
#         link=f"/reservas#reserva-{instance.id}"
#     )

#     # Atualiza contadores do perfil
#     atualizar_perfil(usuario)


# # ===============================
# # EMPRÉSTIMOS → NOTIFICAÇÕES
# # ===============================

# @receiver(post_save, sender=Emprestimo)
# def notificar_emprestimo(sender, instance, created, **kwargs):
#     link = f"/reservas#reserva-{instance.reserva.id}"
#     perfil = instance.reserva.perfil_oficial
#     usuario = perfil.user if perfil else instance.reserva.usuario

#     if created:
#         Notificacao.objects.create(
#             usuario=usuario,
#             titulo="Empréstimo iniciado",
#             descricao=f"Você retirou o livro '{instance.livro.titulo}'. Data de devolução: {instance.data_devolucao}.",
#             tipo="Emprestimo",
#             link=link
#         )
#     else:
#         if instance.acoes == "atrasado":
#             Notificacao.objects.create(
#                 usuario=usuario,
#                 titulo="Devolução em atraso",
#                 descricao=f"O livro '{instance.livro.titulo}' está atrasado! Data de devolução: {instance.data_devolucao}.",
#                 tipo="Emprestimo",
#                 link=link
#             )
#         elif instance.acoes == "devolvido":
#             Notificacao.objects.create(
#                 usuario=usuario,
#                 titulo="Livro devolvido",
#                 descricao=f"O livro '{instance.livro.titulo}' foi devolvido com sucesso.",
#                 tipo="Emprestimo",
#                 link=link
#             )


# # ===============================
# # RESERVAS → COUNT E ESTADO DO PERFIL
# # ===============================

# @receiver(post_save, sender=Reserva)
# def reserva_criada_ou_editada(sender, instance, **kwargs):
#     atualizar_perfil(instance.usuario)


# @receiver(post_delete, sender=Reserva)
# def reserva_apagada(sender, instance, **kwargs):
#     atualizar_perfil(instance.usuario)







































from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from django.db import transaction, IntegrityError

from .models import Emprestimo, Reserva, Livro, Categoria, Notificacao
from administracao.models import Multa


# # ===============================
# # FUNÇÃO AUXILIAR → ATUALIZA PERFIL
# # ===============================

def atualizar_perfil(usuario):
    try:
        reserva_dummy = Reserva(usuario=usuario)
        perfil = reserva_dummy.perfil_oficial

        if perfil:
            perfil.atualizar_contadores()
            perfil.atualizar_estado()
    except Exception as e:
        print("❌ Erro ao atualizar perfil:", e)


# # ===============================
# # NOTIFICAÇÃO SEGURA (ANTI-DUPLICAÇÃO)
# # ===============================

# def criar_notificacao_unica(usuario, titulo, descricao, tipo, link):
#     try:
#         with transaction.atomic():
#             obj, created = Notificacao.objects.get_or_create(
#                 usuario=usuario,
#                 titulo=titulo,
#                 descricao=descricao,
#                 defaults={
#                     "tipo": tipo,
#                     "link": link
#                 }
#             )
#             return created
#     except IntegrityError:
#         return False
#     except Exception as e:
#         print("❌ Erro ao criar notificação:", e)
#         return False


# ===============================
# LIVRO → CONTADOR CATEGORIA
# ===============================

@receiver(post_save, sender=Livro)
def atualizar_total_livro(sender, instance, created, **kwargs):
    try:
        if created and instance.categoria:
            Categoria.objects.filter(pk=instance.categoria.pk).update(
                n_livros=F('n_livros') + 1
            )
    except Exception as e:
        print("❌ Erro categoria livro:", e)


@receiver(post_delete, sender=Livro)
def reduzir_total_livro(sender, instance, **kwargs):
    try:
        if instance.categoria:
            Categoria.objects.filter(pk=instance.categoria.pk).update(
                n_livros=F('n_livros') - 1
            )
    except Exception as e:
        print("❌ Erro remover livro categoria:", e)


# ===============================
# LIVRO → CONTADOR AUTOR
# ===============================

@receiver(post_save, sender=Livro)
def incrementar_total_obras(sender, instance, created, **kwargs):
    try:
        if created and instance.autor:
            type(instance.autor).objects.filter(pk=instance.autor.pk).update(
                total_obras=F('total_obras') + 1
            )
    except Exception as e:
        print("❌ Erro autor +1:", e)


@receiver(post_delete, sender=Livro)
def decrementar_total_obras(sender, instance, **kwargs):
    try:
        if instance.autor:
            type(instance.autor).objects.filter(pk=instance.autor.pk).update(
                total_obras=F('total_obras') - 1
            )
    except Exception as e:
        print("❌ Erro autor -1:", e)


# # ===============================
# # RESERVA → NOTIFICAÇÕES
# # ===============================

# @receiver(post_save, sender=Reserva)
# def notificar_reserva(sender, instance, created, **kwargs):
#     try:
#         perfil = instance.perfil_oficial
#         usuario = perfil.user if perfil else instance.usuario
#         link = f"/reservas#reserva-{instance.id}"

#         if created:
#             criar_notificacao_unica(
#                 usuario,
#                 "Reserva solicitada",
#                 f"Você solicitou a reserva do livro '{instance.livro.titulo}'.",
#                 "Reserva",
#                 link
#             )

#         elif instance.estado == "em_uso":
#             criar_notificacao_unica(
#                 usuario,
#                 "Reserva aprovada",
#                 f"Sua reserva do livro '{instance.livro.titulo}' foi aprovada.",
#                 "Reserva",
#                 link
#             )

#         elif instance.estado == "finalizada":
#             criar_notificacao_unica(
#                 usuario,
#                 "Reserva concluída",
#                 f"Sua reserva do livro '{instance.livro.titulo}' foi finalizada.",
#                 "Reserva",
#                 link
#             )

#     except Exception as e:
#         print("❌ Signal reserva falhou:", e)


# @receiver(post_delete, sender=Reserva)
# def notificar_cancelamento(sender, instance, **kwargs):
#     try:
#         perfil = instance.perfil_oficial
#         usuario = perfil.user if perfil else instance.usuario

#         criar_notificacao_unica(
#             usuario,
#             "Reserva cancelada",
#             f"A reserva do livro '{instance.livro.titulo}' foi cancelada.",
#             "Reserva",
#             f"/reservas#reserva-{instance.id}"
#         )

#         atualizar_perfil(usuario)

#     except Exception as e:
#         print("❌ Signal cancelamento falhou:", e)


# # ===============================
# # EMPRÉSTIMOS → NOTIFICAÇÕES
# # ===============================

# @receiver(post_save, sender=Emprestimo)
# def notificar_emprestimo(sender, instance, created, **kwargs):
#     try:
#         perfil = instance.reserva.perfil_oficial
#         usuario = perfil.user if perfil else instance.reserva.usuario
#         link = f"/reservas#reserva-{instance.reserva.id}"

#         if created:
#             criar_notificacao_unica(
#                 usuario,
#                 "Empréstimo iniciado",
#                 f"Você retirou o livro '{instance.livro.titulo}'.",
#                 "Emprestimo",
#                 link
#             )

#         elif instance.acoes == "atrasado":
#             criar_notificacao_unica(
#                 usuario,
#                 "Livro em atraso",
#                 f"O livro '{instance.livro.titulo}' está atrasado.",
#                 "Emprestimo",
#                 link
#             )

#         elif instance.acoes == "devolvido":
#             criar_notificacao_unica(
#                 usuario,
#                 "Livro devolvido",
#                 f"O livro '{instance.livro.titulo}' foi devolvido com sucesso.",
#                 "Emprestimo",
#                 link
#             )

#     except Exception as e:
#         print("❌ Signal emprestimo falhou:", e)


# # ===============================
# # MULTA → NOTIFICAÇÃO
# # ===============================

# @receiver(post_save, sender=Multa)
# def notificar_multa(sender, instance, created, **kwargs):
#     if not created:
#         return

#     try:
#         perfil = instance.emprestimo.reserva.perfil_oficial
#         usuario = perfil.user if perfil else instance.emprestimo.reserva.usuario

#         criar_notificacao_unica(
#             usuario,
#             "Multa aplicada",
#             f"Foi aplicada uma multa de {instance.valor} AKZ por atraso.",
#             "Multa",
#             f"/multas#{instance.id}"
#         )

#     except Exception as e:
#         print("❌ Signal multa falhou:", e)


# ===============================
# RESERVA → PERFIL
# ===============================

@receiver(post_save, sender=Reserva)
def reserva_criada_ou_editada(sender, instance, **kwargs):
    atualizar_perfil(instance.usuario)


@receiver(post_delete, sender=Reserva)
def reserva_apagada(sender, instance, **kwargs):
    atualizar_perfil(instance.usuario)


