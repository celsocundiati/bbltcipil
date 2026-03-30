# from django.db.models.signals import post_save, post_delete
# from django.dispatch import receiver
# from django.forms.models import model_to_dict
# from django.utils import timezone

# from .models import AuditLog
# from .context import get_current_user, get_request_meta, get_trace_id
# from .services import AuditService


# def safe_model_to_dict(instance):
#     try:
#         data = model_to_dict(instance)
#         for key, value in data.items():
#             if hasattr(value, "isoformat"):
#                 data[key] = value.isoformat()
#         return data
#     except Exception:
#         return {}


# def should_skip_log(sender):
#     return sender == AuditLog


# @receiver(post_save)
# def log_save(sender, instance, created, **kwargs):
#     if should_skip_log(sender):
#         return

#     trace_id = get_trace_id()

#     action = "Criou" if created else "Atualizou"

#     # 🔥 delega para o service (centralização total)
#     AuditService.log(
#         action=action,
#         instance=instance,
#         extra=safe_model_to_dict(instance),
#         origem="automatico",
#         trace_id=trace_id
#     )


# @receiver(post_delete)
# def log_delete(sender, instance, **kwargs):
#     if should_skip_log(sender):
#         return

#     trace_id = get_trace_id()

#     AuditService.log(
#         action="Removeu",
#         instance=instance,
#         origem="automatico",
#         trace_id=trace_id
#     )







from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.forms.models import model_to_dict

from .models import AuditLog
from .context import get_current_user, get_request_meta, get_trace_id
from .services import AuditService


def serialize_value(value):
    if hasattr(value, "isoformat"):
        return value.isoformat()

    if hasattr(value, "pk"):
        return str(value)

    if isinstance(value, list):
        return [serialize_value(v) for v in value]

    return value


def safe_model_to_dict(instance):
    try:
        data = model_to_dict(instance)

        # 🔥 tratar ManyToMany
        for field in instance._meta.many_to_many:
            data[field.name] = list(
                getattr(instance, field.name).values_list("name", flat=True)
            )

        return {k: serialize_value(v) for k, v in data.items()}
    except Exception:
        return {}


def should_skip_log(sender):
    return sender == AuditLog


@receiver(post_save)
def log_save(sender, instance, created, **kwargs):
    if should_skip_log(sender):
        return

    user = get_current_user()
    ip = get_request_meta()
    trace_id = get_trace_id()

    action = "Criou" if created else "Atualizou"

    AuditService.log(
        user=user,  # 🔥 AGORA VEM DO MIDDLEWARE
        action=action,
        instance=instance,
        extra=safe_model_to_dict(instance),
        origem="manual" if user else "system",
        ip=ip,
        trace_id=trace_id
    )


@receiver(post_delete)
def log_delete(sender, instance, **kwargs):
    if should_skip_log(sender):
        return

    user = get_current_user()
    ip = get_request_meta()
    trace_id = get_trace_id()

    AuditService.log(
        user=user,
        action="Removeu",
        instance=instance,
        extra=safe_model_to_dict(instance),
        origem="manual" if user else "system",
        ip=ip,
        trace_id=trace_id
    )



    