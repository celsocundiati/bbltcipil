from administracao.models import ConfiguracaoSistema
from administracao.utils import get_config


def get_config():
    config = ConfiguracaoSistema.objects.first()
    if not config:
        raise Exception("Configuração do sistema não definida")
    return config

def multas_ativas():
    return get_config().cobranca_ativa

