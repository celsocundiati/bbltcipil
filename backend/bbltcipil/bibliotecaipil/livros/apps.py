from django.apps import AppConfig

class LivrosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'livros'

    def ready(self):
        import livros.events  # 🔥 REGISTA EVENTOS