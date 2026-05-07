from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Reserva, Livro, Participacao
from livros.services.counters import rebuild_categoria, rebuild_autor


@receiver(post_save, sender=Livro)
def livro_save(sender, instance, **kwargs):
    if instance.categoria_id:
        rebuild_categoria(instance.categoria_id)

    if instance.autor_id:
        rebuild_autor(instance.autor_id)


@receiver(post_delete, sender=Livro)
def livro_delete(sender, instance, **kwargs):
    if instance.categoria_id:
        rebuild_categoria(instance.categoria_id)

    if instance.autor_id:
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



        