from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.forms.models import model_to_dict
from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in

from .models import AuditLog
from livros.models import Livro, Reserva, Emprestimo
from administracao.middleware import get_current_user

User = get_user_model()


# -------------------------------
# LOGIN ADMIN
# -------------------------------
@receiver(user_logged_in)
def log_login(sender, request, user, **kwargs):
    if user.is_staff:
        AuditLog.objects.create(
            usuario=user,
            acao="login",
            modelo="LoginAdmin",
            objeto_id=user.id,
            alteracoes={"ip": request.META.get("REMOTE_ADDR")}
        )
        print(f"[AuditLog] LoginAdmin: {user.username}")


# -------------------------------
# LIVRO
# -------------------------------
@receiver(post_save, sender=Livro)
def log_livro(sender, instance, created, **kwargs):
    usuario_atual = get_current_user()
    if not usuario_atual:
        return

    if created:
        AuditLog.objects.create(
            usuario=usuario_atual,
            acao="create",
            modelo="Livro",
            objeto_id=instance.id,
            alteracoes={"titulo": instance.titulo}
        )
        print(f"[AuditLog] Livro criado: {instance.titulo} por {usuario_atual.username}")
    else:
        try:
            antigo = Livro.objects.get(pk=instance.pk)
        except Livro.DoesNotExist:
            antigo = None

        if antigo:
            diferencas = {
                c: {"antes": getattr(antigo, c), "depois": getattr(instance, c)}
                for c in antigo._meta.fields_map.keys() if getattr(antigo, c) != getattr(instance, c)
            }
            if diferencas:
                AuditLog.objects.create(
                    usuario=usuario_atual,
                    acao="update",
                    modelo="Livro",
                    objeto_id=instance.pk,
                    alteracoes=diferencas
                )
                print(f"[AuditLog] Livro atualizado: {instance.titulo} por {usuario_atual.username}")


@receiver(post_delete, sender=Livro)
def log_delete_livro(sender, instance, **kwargs):
    usuario_atual = get_current_user()
    if usuario_atual:
        AuditLog.objects.create(
            usuario=usuario_atual,
            acao="delete",
            modelo="Livro",
            objeto_id=instance.id,
            alteracoes={"titulo": instance.titulo}
        )
        print(f"[AuditLog] Livro deletado: {instance.titulo} por {usuario_atual.username}")


# -------------------------------
# RESERVA
# -------------------------------
@receiver(post_save, sender=Reserva)
def log_reserva(sender, instance, created, **kwargs):
    usuario_atual = get_current_user()
    if not usuario_atual:
        return

    if created:
        AuditLog.objects.create(
            usuario=usuario_atual,
            acao="create",
            modelo="Reserva",
            objeto_id=instance.id,
            alteracoes={"livro": instance.livro.titulo, "estado": instance.estado}
        )
        print(f"[AuditLog] Reserva criada: ID {instance.id} por {usuario_atual.username}")
    else:
        try:
            antiga = Reserva.objects.get(pk=instance.pk)
        except Reserva.DoesNotExist:
            return

        if antiga.estado != instance.estado and instance.estado == "aprovada":
            AuditLog.objects.create(
                usuario=usuario_atual,
                acao="approve",
                modelo="Reserva",
                objeto_id=instance.id,
                alteracoes={"antes": antiga.estado, "depois": instance.estado}
            )
            print(f"[AuditLog] Reserva aprovada: ID {instance.id} por {usuario_atual.username}")


# -------------------------------
# EMPRESTIMO
# -------------------------------
@receiver(post_save, sender=Emprestimo)
def log_emprestimo(sender, instance, created, **kwargs):
    usuario_atual = get_current_user()
    if not usuario_atual:
        return

    if created:
        AuditLog.objects.create(
            usuario=usuario_atual,
            acao="create",
            modelo="Emprestimo",
            objeto_id=instance.id,
            alteracoes={"livro": instance.livro.titulo, "aluno": instance.aluno.nome}
        )
        print(f"[AuditLog] Empréstimo iniciado: ID {instance.id} por {usuario_atual.username}")
    else:
        try:
            antigo = Emprestimo.objects.get(pk=instance.pk)
        except Emprestimo.DoesNotExist:
            return

        if not antigo.devolvido and instance.devolvido:
            AuditLog.objects.create(
                usuario=usuario_atual,
                acao="update",
                modelo="Emprestimo",
                objeto_id=instance.id,
                alteracoes={"status": "Livro devolvido"}
            )
            print(f"[AuditLog] Livro devolvido: ID {instance.id} por {usuario_atual.username}")