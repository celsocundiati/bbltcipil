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
def notificar_reserva(sender, instance, created, **kwargs):
    link = f"/reservas#reserva-{instance.id}"  # gera o link automático
    if created:
        Notificacao.objects.create(
            usuario=instance.aluno.user,
            titulo="Reserva solicitada",
            descricao=f"Você solicitou a reserva do livro '{instance.livro.titulo}'.",
            tipo="Reserva",
            link=link
        )
    else:
        # Quando a reserva muda para 'aprovada'
        if instance.estado == "aprovada":
            Notificacao.objects.create(
                usuario=instance.aluno.user,
                titulo="Reserva aprovada",
                descricao=f"Sua reserva do livro '{instance.livro.titulo}' foi aprovada e está pronta para empréstimo.",
                tipo="Reserva",
                link=link
            )

@receiver(post_delete, sender=Reserva)
def notificar_cancelamento(sender, instance, **kwargs):
    if instance.aluno:
        Notificacao.objects.create(
            usuario=instance.aluno.user,
            titulo="Reserva cancelada",
            descricao=f"A reserva do livro '{instance.livro.titulo}' foi cancelada.",
            tipo="Reserva",
            link=f"/reservas#reserva-{instance.id}"
        )

# ===============================
# EMPRÉSTIMOS → NOTIFICAÇÕES
# ===============================
@receiver(post_save, sender=Emprestimo)
def notificar_emprestimo(sender, instance, created, **kwargs):
    link = f"/emprestimos#emprestimo-{instance.id}"
    if created:
        Notificacao.objects.create(
            usuario=instance.aluno.user,
            titulo="Empréstimo iniciado",
            descricao=f"Você retirou o livro '{instance.livro.titulo}'. Data de devolução: {instance.data_devolucao}.",
            tipo="Emprestimo",
            link=link
        )
    else:
        if instance.acoes == "atrasado":
            Notificacao.objects.create(
                usuario=instance.aluno.user,
                titulo="Devolução em atraso",
                descricao=f"O livro '{instance.livro.titulo}' está atrasado! Data de devolução: {instance.data_devolucao}.",
                tipo="Emprestimo",
                link=link
            )
        elif instance.acoes == "devolvido":
            Notificacao.objects.create(
                usuario=instance.aluno.user,
                titulo="Livro devolvido",
                descricao=f"O livro '{instance.livro.titulo}' foi devolvido com sucesso.",
                tipo="Emprestimo",
                link=link
            )