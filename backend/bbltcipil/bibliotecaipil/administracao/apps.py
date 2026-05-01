from django.apps import AppConfig

class AdministracaoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'administracao'

    def ready(self):
        import administracao.events  # 🔥 REGISTA EVENTOS

        