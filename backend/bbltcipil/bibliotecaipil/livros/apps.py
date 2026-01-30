from django.apps import AppConfig

class LivrosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'livros'

    def ready(self):
        # Importa os signals automaticamente quando o Django inicia
        from . import signals
