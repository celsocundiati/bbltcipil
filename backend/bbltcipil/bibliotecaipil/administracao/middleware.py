import threading
from django.contrib.auth.models import AnonymousUser

_user = threading.local()


def get_current_user():
    """
    Retorna o usuário da thread atual.
    Só funciona se a requisição passou pelo middleware.
    """
    user = getattr(_user, "value", None)
    if isinstance(user, AnonymousUser):
        return None
    return user


class CurrentUserMiddleware:
    """
    Middleware para armazenar o usuário atual em thread local.
    Necessário para os signals do AuditLog.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _user.value = request.user
        response = self.get_response(request)
        _user.value = None  # limpa após requisição
        return response