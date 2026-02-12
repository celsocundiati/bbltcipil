from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from .models import Emprestimo, Reserva, Livro, Aluno
from django.db.models import F

@receiver(post_save, sender=Livro)
def atualizar_total_livro(sender, instance, created, **kwargs):
    if created and instance.categoria:
        instance.categoria.n_livros = F('n_livros') + 1
        instance.categoria.save(update_fields=['n_livros'])

@receiver(post_delete, sender=Livro)
def reduzir_total_livro(sender, instance, **kwargs):
    if instance.categoria:
        instance.categoria.n_livros = F('n_livros') - 1
        instance.categoria.save(update_fields=['n_livros'])

@receiver(post_save, sender=Livro)
def incrementar_total_obras(sender, instance, created, **kwargs):
    if created and instance.autor:
        instance.autor.total_obras = F('total_obras') + 1
        instance.autor.save(update_fields=['total_obras'])

@receiver(post_delete, sender=Livro)
def decrementar_total_obras(sender, instance, **kwargs):
    if instance.autor:
        instance.autor.total_obras = F('total_obras') - 1
        instance.autor.save(update_fields=['total_obras'])