import uuid
from .context import set_current_user, set_request_meta, set_trace_id

class AuditMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        user = request.user if request.user.is_authenticated else None
        ip = self.get_client_ip(request)
        trace_id = str(uuid.uuid4())

        set_current_user(user)
        set_request_meta(ip)
        set_trace_id(trace_id)

        try:
            response = self.get_response(request)
        finally:
            # 🔥 LIMPEZA (EVITA VAZAMENTO ENTRE REQUESTS)
            set_current_user(None)
            set_request_meta(None)
            set_trace_id(None)

        return response

    def get_client_ip(self, request):
        x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded:
            return x_forwarded.split(",")[0]
        return request.META.get("REMOTE_ADDR")
    

    