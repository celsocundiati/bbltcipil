from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Emprestimo, Reserva, Livro, Aluno
from django.db.models import F

# Contadores do aluno
@receiver(post_save, sender=Reserva)
def atualizar_contador_reservas(sender, instance, **kwargs):
    instance.aluno.atualizar_contadores()  # delega para a função do modelo

@receiver(post_save, sender=Emprestimo)
def atualizar_contador_emprestimos(sender, instance, **kwargs):
    instance.aluno.atualizar_contadores()  # mesma coisa

def atualizar_contadores(self):
    total_reservas = self.reservas.count()

    total_emprestimos = Emprestimo.objects.filter(
        reserva__aluno=self
    ).count()

    self.total_reservas = total_reservas
    self.total_emprestimos = total_emprestimos
    self.save(update_fields=["total_reservas", "total_emprestimos"])


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


def atualizar_autor(sender, instance, created, **kwargs):
    if not instance.pk:
        return

    livro_antigo = Livro.objects.get(pk=instance.pk)
    if livro_antigo.autor != instance.autor:
        livro_antigo.autor.total_obras -=1
        livro_antigo.autor.save()

        instance.autor.total_obras +=1
        instance.autor.save()

@receiver(pre_save, sender=Livro)
def guardar_autor_categoria_antigo(sender, instance, **kwargs):
    if instance.pk:
        livro_antigo = Livro.objects.get(pk=instance.pk)
        instance._autor_antigo = livro_antigo.autor
        instance._categoria_antigo = livro_antigo.categoria

@receiver(post_save, sender=Livro)
def atualizar_autor_categoria_em_edicao(sender, instance, created, **kwargs):
    if created:
        return

    autor_antigo = getattr(instance, '_autor_antigo', None)
    autor_novo = instance.autor

    if autor_antigo != autor_novo:
        if autor_antigo:
            autor_antigo.total_obras = F('total_obras') - 1
            autor_antigo.save(update_fields=['total_obras'])
            
        if autor_novo:
            autor_novo.total_obras = F('total_obras') + 1
            autor_novo.save(update_fields=['total_obras'])
            
    categoria_antigo = getattr(instance, '_categoria_antigo', None)
    categoria_novo = instance.categoria

    if categoria_antigo != categoria_novo:
        if categoria_antigo:
            categoria_antigo.total_obras = F('n_livros') - 1
            categoria_antigo.save(update_fields=['n_livros'])
            

        if categoria_novo:
            categoria_novo.total_obras = F('n_livros') + 1
            categoria_novo.save(update_fields=['n_livros'])
            
    if autor_novo:
        autor_novo.refresh_from_db()
    if categoria_novo:
        categoria_novo.refresh_from_db()
    instance.refresh_from_db()