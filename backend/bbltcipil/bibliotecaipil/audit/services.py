from django.contrib.contenttypes.models import ContentType
from .models import AuditLog
from .context import get_current_user, get_request_meta, get_trace_id


class AuditService:

    @staticmethod
    def log(user=None, action=None, instance=None, extra=None, origem=None, ip=None, trace_id=None):
        """
        Log inteligente:
        - Usa contexto automaticamente
        - Evita duplicação
        - Garante rastreabilidade
        """

        # 🔥 FALLBACK AUTOMÁTICO
        user = user or get_current_user()
        ip = ip or get_request_meta()
        trace_id = trace_id or get_trace_id()

        # 🔥 DEFINE ORIGEM INTELIGENTE
        if not origem:
            if user:
                origem = "manual"
            else:
                origem = "system"

        content_type = ContentType.objects.get_for_model(instance)

        # 🔥 EVITA DUPLICAÇÃO (ESSENCIAL)
        if trace_id:
            exists = AuditLog.objects.filter(
                modelo=content_type,
                objeto_id=instance.pk,
                trace_id=trace_id
            ).exists()

            if exists:
                return  # já logado

        AuditLog.objects.create(
            usuario=user,
            acao=action,
            modelo=content_type,
            objeto_id=instance.pk,
            alteracoes=extra or {},
            origem=origem,
            ip_address=ip,
            trace_id=trace_id
        )


        