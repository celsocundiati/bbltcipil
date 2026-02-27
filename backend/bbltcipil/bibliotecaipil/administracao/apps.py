from django.apps import AppConfig

class AdministracaoConfig(AppConfig):
    name = 'administracao'
    default_auto_field = 'django.db.models.BigAutoField'

    def ready(self):
        import administracao.signals