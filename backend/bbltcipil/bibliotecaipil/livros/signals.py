from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from .models import Emprestimo, Reserva, Livro, Categoria, Notificacao


# ===============================
# LIVRO → CONTADOR CATEGORIA
# ===============================

@receiver(post_save, sender=Livro)
def atualizar_total_livro(sender, instance, created, **kwargs):
    if created and instance.categoria:
        Categoria.objects.filter(pk=instance.categoria.pk).update(
            n_livros=F('n_livros') + 1
        )


@receiver(post_delete, sender=Livro)
def reduzir_total_livro(sender, instance, **kwargs):
    if instance.categoria:
        Categoria.objects.filter(pk=instance.categoria.pk).update(
            n_livros=F('n_livros') - 1
        )


# ===============================
# LIVRO → CONTADOR AUTOR
# ===============================

@receiver(post_save, sender=Livro)
def incrementar_total_obras(sender, instance, created, **kwargs):
    if created and instance.autor:
        type(instance.autor).objects.filter(pk=instance.autor.pk).update(
            total_obras=F('total_obras') + 1
        )


@receiver(post_delete, sender=Livro)
def decrementar_total_obras(sender, instance, **kwargs):
    if instance.autor:
        type(instance.autor).objects.filter(pk=instance.autor.pk).update(
            total_obras=F('total_obras') - 1
        )


# ===============================
# RESERVA → NOTIFICAÇÕES
# ===============================

@receiver(post_save, sender=Reserva)
def criar_notificacao_reserva(sender, instance, created, **kwargs):
    if created:
        Notificacao.objects.create(
            usuario=instance.aluno.user,
            titulo="Reserva criada",
            descricao=f"Você reservou o livro '{instance.livro.titulo}'.",
            tipo="reserva"
        )


@receiver(post_delete, sender=Reserva)
def notificar_cancelamento(sender, instance, **kwargs):
    Notificacao.objects.create(
        usuario=instance.aluno.user,
        titulo="Reserva cancelada",
        descricao=f"A reserva do livro '{instance.livro.titulo}' foi cancelada.",
        tipo="reserva_cancelada"
    )


# ===============================
# EMPRESTIMO → DEVOLUÇÃO
# ===============================

@receiver(pre_save, sender=Emprestimo)
def notificar_devolucao(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        antigo = Emprestimo.objects.get(pk=instance.pk)
    except Emprestimo.DoesNotExist:
        return

    if antigo.acoes != "devolvido" and instance.acoes == "devolvido":
        Notificacao.objects.create(
            usuario=instance.aluno.user,
            titulo="Livro devolvido",
            descricao=f"O livro '{instance.livro.titulo}' foi devolvido com sucesso.",
            tipo="devolucao"
        )