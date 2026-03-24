
from django.core.cache import cache
from .models import ConfiguracaoSistema

def get_config():
    config = cache.get("config_sistema")

    if not config:
        config, _ = ConfiguracaoSistema.objects.get_or_create(id=1)
        cache.set("config_sistema", config, timeout=300)

    return config