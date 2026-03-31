# administracao/__init__.py
default_app_config = "administracao.apps.AdministracaoConfig"

# Importa todos os events para registrar handlers
import audit.events  # ⚡ garante que EVENT_HANDLERS seja preenchido