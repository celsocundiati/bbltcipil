from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.forms.models import model_to_dict

from .models import AuditLog
from .context import get_current_user, get_request_meta, get_trace_id


@receiver(post_save)
def log_save(sender, instance, created, **kwargs):
    if sender == AuditLog:
        return

    user = get_current_user()
    ip = get_request_meta()
    trace_id = get_trace_id()

    action = "Criou" if created else "Atualizou"

    try:
        changes = model_to_dict(instance)
    except:
        changes = {}

    AuditLog.objects.create(
        usuario=user,
        acao=action,
        modelo=ContentType.objects.get_for_model(sender),
        objeto_id=instance.pk,
        alteracoes=changes,
        origem="manual" if user else "automatico",
        ip_address=ip,
        trace_id=trace_id,
    )


@receiver(post_delete)
def log_delete(sender, instance, **kwargs):
    if sender == AuditLog:
        return

    user = get_current_user()
    ip = get_request_meta()
    trace_id = get_trace_id()

    AuditLog.objects.create(
        usuario=user,
        acao="Removeu",
        modelo=ContentType.objects.get_for_model(sender),
        objeto_id=instance.pk,
        origem="manual" if user else "automatico",
        ip_address=ip,
        trace_id=trace_id,
    )