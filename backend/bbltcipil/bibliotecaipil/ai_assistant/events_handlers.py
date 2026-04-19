from bibliotecaipil.events import register_event
from .rag_engine import resetar_cache, preload


@register_event("livro_criado")
def atualizar_rag(payload):
    print("📚 Novo livro detectado. Atualizando IA...")
    resetar_cache()
    preload()


@register_event("mensagem_processada")
def log_interacao(payload):
    print("💬 Interação registrada:")
    print(payload["pergunta"])