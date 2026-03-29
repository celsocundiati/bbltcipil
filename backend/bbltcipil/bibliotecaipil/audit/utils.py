from django.contrib.auth import get_user_model
from .context import set_current_user

User = get_user_model()


def set_system_user():
    user, _ = User.objects.get_or_create(
        username="system_bot",
        defaults={"is_staff": True}
    )
    set_current_user(user)