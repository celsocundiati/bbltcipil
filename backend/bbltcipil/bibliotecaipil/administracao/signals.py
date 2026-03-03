from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in
from .models import AuditLog

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

