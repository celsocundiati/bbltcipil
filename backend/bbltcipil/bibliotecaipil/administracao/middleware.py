import threading
from django.contrib.auth.models import AnonymousUser

_user = threading.local()

class CurrentUserMiddleware:
    """
    Middleware para armazenar o usuário atual em thread local.
    Necessário para os signals do AuditLog.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _user.value = request.user  # salva o usuário logado na thread
        response = self.get_response(request)
        _user.value = None  # limpa após a requisição
        return response


def get_current_user():
    """
    Retorna o usuário atual da requisição, ou None se não houver.
    """
    user = getattr(_user, "value", None)
    if isinstance(user, AnonymousUser):
        return None
    return user