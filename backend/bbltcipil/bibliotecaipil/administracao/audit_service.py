

# class AuditService:
#     @staticmethod
#     def log(user, action, instance, extra=None):
#         from audit.models import AuditLog
#         AuditLog.objects.create(
#             usuario=user,
#             acao=action,
#             modelo=instance.__class__.__name__,
#             objeto_id=instance.id,
#             alteracoes=extra or {}
#         )

from django.contrib.contenttypes.models import ContentType

class AuditService:
    @staticmethod
    def log(user, action, instance, extra=None):
        from audit.models import AuditLog

        AuditLog.objects.create(
            usuario=user,
            acao=action,
            modelo=ContentType.objects.get_for_model(instance),  # ✅ correto
            objeto_id=instance.id,
            alteracoes=extra or {}
        )





        