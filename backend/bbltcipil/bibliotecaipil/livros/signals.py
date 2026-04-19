from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Reserva, Livro, Participacao


@receiver(post_save, sender=Livro)
def livro_save(sender, instance, created, **kwargs):
    if not instance.pk:
        return

    if instance.categoria:
        from livros.services.counters import rebuild_categoria
        rebuild_categoria(instance.categoria_id)

    if instance.autor:
        from livros.services.counters import rebuild_autor
        rebuild_autor(instance.autor_id)


@receiver(post_delete, sender=Livro)
def livro_delete(sender, instance, **kwargs):
    if instance.categoria:
        from livros.services.counters import rebuild_categoria
        rebuild_categoria(instance.categoria_id)

    if instance.autor:
        from livros.services.counters import rebuild_autor
        rebuild_autor(instance.autor_id)


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

# ===============================
# LIVRO → CONTADOR CATEGORIA
# ===============================

# @receiver(post_save, sender=Livro)
# def atualizar_total_livro(sender, instance, created, **kwargs):
#     try:
#         if created and instance.categoria:
#             Categoria.objects.filter(pk=instance.categoria.pk).update(
#                 n_livros=F('n_livros') + 1
#             )
#     except Exception as e:
#         print("❌ Erro categoria livro:", e)


# @receiver(post_delete, sender=Livro)
# def reduzir_total_livro(sender, instance, **kwargs):
#     try:
#         if instance.categoria:
#             Categoria.objects.filter(pk=instance.categoria.pk).update(
#                 n_livros=F('n_livros') - 1
#             )

#             # 🔒 segurança pós-update (opcional mas recomendado)
#             Categoria.objects.filter(pk=instance.categoria.pk, n_livros__lt=0).update(
#                 n_livros=0
#             )
#     except Exception as e:
#         print("❌ Erro remover livro categoria:", e)
        


# ===============================
# LIVRO → CONTADOR AUTOR
# ===============================

# @receiver(post_save, sender=Livro)
# def incrementar_total_obras(sender, instance, created, **kwargs):
#     try:
#         if created and instance.autor:
#             type(instance.autor).objects.filter(pk=instance.autor.pk).update(
#                 total_obras=F('total_obras') + 1
#             )
#     except Exception as e:
#         print("❌ Erro autor +1:", e)


# @receiver(post_delete, sender=Livro)
# def decrementar_total_obras(sender, instance, **kwargs):
#     try:
#         if instance.autor:
#             type(instance.autor).objects.filter(pk=instance.autor.pk).update(
#                 total_obras=F('total_obras') - 1
#             )
#     except Exception as e:
#         print("❌ Erro autor -1:", e)


# ===============================
# RESERVA → PERFIL
# ===============================

@receiver(post_save, sender=Reserva)
def reserva_criada_ou_editada(sender, instance, **kwargs):
    atualizar_perfil(instance.usuario)


@receiver(post_delete, sender=Reserva)
def reserva_apagada(sender, instance, **kwargs):
    atualizar_perfil(instance.usuario)


""" @receiver(post_save, sender=Livro)
def livro_criado(sender, instance, created, **kwargs):
    if created:
        emit_event("livro_criado", {
            "livro_id": instance.id
        })
 """

@receiver(post_save, sender=Participacao)
def atualizar_estado_apos_criar(sender, instance, created, **kwargs):
    if created:
        exposicao = instance.exposicao
        exposicao.atualizar_estado()
        exposicao.save()

        evento = instance.evento
        evento.atualizar_estado()
        evento.save()


@receiver(post_delete, sender=Participacao)
def atualizar_estado_apos_remover(sender, instance, **kwargs):
        exposicao = instance.exposicao
        exposicao.atualizar_estado()
        exposicao.save()

        evento = instance.evento
        evento.atualizar_estado()
        evento.save()



        