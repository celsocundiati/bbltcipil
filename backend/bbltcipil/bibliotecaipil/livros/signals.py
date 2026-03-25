from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from .models import Emprestimo, Reserva, Livro, Categoria, Notificacao

# ===============================
# FUNÇÃO AUXILIAR → ATUALIZA PERFIL
# ===============================

def atualizar_perfil(usuario):
    """
    Atualiza contadores e estado do perfil do usuário
    """
    perfil = None
    # Criar reserva dummy apenas para acessar perfil_oficial
    reserva_dummy = Reserva(usuario=usuario)
    perfil = reserva_dummy.perfil_oficial

    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()


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
    link = f"/reservas#reserva-{instance.id}"  
    perfil = instance.perfil_oficial
    usuario = perfil.user if perfil else instance.usuario

    if created:
        Notificacao.objects.create(
            usuario=usuario,
            titulo="Reserva solicitada",
            descricao=f"Você solicitou a reserva do livro '{instance.livro.titulo}'.",
            tipo="Reserva",
            link=link
        )
    else:
        if instance.estado == "em_uso":
            Notificacao.objects.create(
                usuario=usuario,
                titulo="Reserva aprovada",
                descricao=f"Sua reserva do livro '{instance.livro.titulo}' foi aprovada e está em uso actualmentte.",
                tipo="Reserva",
                link=link
            )
        else:
            if instance.estado == "finalizada":
                Notificacao.objects.create(
                    usuario=usuario,
                    titulo="Reserva concluída",
                    descricao=f"Sua reserva do livro '{instance.livro.titulo}' foi finalizada.",
                    tipo="Reserva",
                    link=link
                )


@receiver(post_delete, sender=Reserva)
def notificar_cancelamento(sender, instance, **kwargs):
    perfil = instance.perfil_oficial
    usuario = perfil.user if perfil else instance.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Reserva cancelada",
        descricao=f"A reserva do livro '{instance.livro.titulo}' foi cancelada.",
        tipo="Reserva",
        link=f"/reservas#reserva-{instance.id}"
    )

    # Atualiza contadores do perfil
    atualizar_perfil(usuario)


# ===============================
# EMPRÉSTIMOS → NOTIFICAÇÕES
# ===============================

@receiver(post_save, sender=Emprestimo)
def notificar_emprestimo(sender, instance, created, **kwargs):
    link = f"/reservas#reserva-{instance.reserva.id}"
    perfil = instance.reserva.perfil_oficial
    usuario = perfil.user if perfil else instance.reserva.usuario

    if created:
        Notificacao.objects.create(
            usuario=usuario,
            titulo="Empréstimo iniciado",
            descricao=f"Você retirou o livro '{instance.livro.titulo}'. Data de devolução: {instance.data_devolucao}.",
            tipo="Emprestimo",
            link=link
        )
    else:
        if instance.acoes == "atrasado":
            Notificacao.objects.create(
                usuario=usuario,
                titulo="Devolução em atraso",
                descricao=f"O livro '{instance.livro.titulo}' está atrasado! Data de devolução: {instance.data_devolucao}.",
                tipo="Emprestimo",
                link=link
            )
        elif instance.acoes == "devolvido":
            Notificacao.objects.create(
                usuario=usuario,
                titulo="Livro devolvido",
                descricao=f"O livro '{instance.livro.titulo}' foi devolvido com sucesso.",
                tipo="Emprestimo",
                link=link
            )


# ===============================
# RESERVAS → COUNT E ESTADO DO PERFIL
# ===============================

@receiver(post_save, sender=Reserva)
def reserva_criada_ou_editada(sender, instance, **kwargs):
    atualizar_perfil(instance.usuario)


@receiver(post_delete, sender=Reserva)
def reserva_apagada(sender, instance, **kwargs):
    atualizar_perfil(instance.usuario)



