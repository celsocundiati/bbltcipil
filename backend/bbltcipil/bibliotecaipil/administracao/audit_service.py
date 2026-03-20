

class AuditService:
    @staticmethod
    def log(user, action, instance, extra=None):
        from .models import AuditLog
        AuditLog.objects.create(
            usuario=user,
            acao=action,
            modelo=instance.__class__.__name__,
            objeto_id=instance.id,
            alteracoes=extra or {}
        )