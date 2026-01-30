from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Emprestimo, Reserva, Livro, Aluno

# Contadores do aluno
@receiver(post_save, sender=Reserva)
def atualizar_contador_reservas(sender, instance, **kwargs):
    instance.aluno.atualizar_contadores()  # delega para a função do modelo

@receiver(post_save, sender=Emprestimo)
def atualizar_contador_emprestimos(sender, instance, **kwargs):
    instance.aluno.atualizar_contadores()  # mesma coisa

# Reduz estoque ao criar empréstimo
@receiver(post_save, sender=Emprestimo)
def reduzir_estoque_ao_emprestar(sender, instance, created, **kwargs):
    if created:
        livro = instance.livro
        if livro.quantidade > 0:
            livro.quantidade -= 1
            livro.save(update_fields=['quantidade'])
        else:
            raise ValueError(f"Não é possível emprestar '{livro.titulo}': estoque insuficiente.")

# Restaura estoque quando acoes == 'devolvido'
@receiver(post_save, sender=Emprestimo)
def restaurar_estoque_ao_devolver(sender, instance, **kwargs):
    if instance.acoes == 'devolvido':
        livro = instance.livro
        livro.quantidade += 1
        livro.save(update_fields=['quantidade'])
