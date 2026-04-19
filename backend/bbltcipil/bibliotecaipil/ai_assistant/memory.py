from .models import Mensagem


# =========================
# 🧠 MEMÓRIA
# =========================
def obter_memoria_inteligente(chat):

    try:
        mensagens = Mensagem.objects.filter(chat=chat).order_by("-criado_em")[:15]
    except Exception:
        return {
            "ultima_intencao": None,
            "ultima_entidade": None,
            "ultima_acao": None
        }

    memoria = {
        "ultima_intencao": None,
        "ultima_entidade": None,
        "ultima_acao": None
    }

    for m in mensagens:

        if m.tipo != "user":
            continue

        texto = m.texto.lower()

        if "livro" in texto:
            memoria["ultima_entidade"] = "livros"

            if "categoria" in texto:
                memoria["ultima_intencao"] = "livros_categoria"
                memoria["ultima_acao"] = "listar"

            elif "autor" in texto:
                memoria["ultima_intencao"] = "livros_autor"
                memoria["ultima_acao"] = "listar"

            elif "quant" in texto:
                memoria["ultima_intencao"] = "livros_qtd"
                memoria["ultima_acao"] = "contar"

            else:
                memoria["ultima_intencao"] = "livros_lista"
                memoria["ultima_acao"] = "listar"

            break

        elif "categoria" in texto:
            memoria["ultima_entidade"] = "categorias"

            if "quant" in texto:
                memoria["ultima_intencao"] = "categorias_qtd"
                memoria["ultima_acao"] = "contar"
            else:
                memoria["ultima_intencao"] = "categorias_lista"
                memoria["ultima_acao"] = "listar"

            break

        elif "autor" in texto:
            memoria["ultima_entidade"] = "autores"
            memoria["ultima_intencao"] = "autores_lista"
            memoria["ultima_acao"] = "listar"
            break

        elif "reserv" in texto:
            memoria["ultima_entidade"] = "reservas"

            if "quant" in texto:
                memoria["ultima_intencao"] = "reservas_qtd"
                memoria["ultima_acao"] = "contar"
            else:
                memoria["ultima_intencao"] = "reservas_lista"
                memoria["ultima_acao"] = "listar"

            break

        elif "emprestim" in texto:
            memoria["ultima_entidade"] = "emprestimos"

            if "quant" in texto:
                memoria["ultima_intencao"] = "emprestimos_qtd"
                memoria["ultima_acao"] = "contar"
            else:
                memoria["ultima_intencao"] = "emprestimos_lista"
                memoria["ultima_acao"] = "listar"

            break

    return memoria


# =========================
# 🔁 FOLLOW-UP
# =========================
def resolver_followup(texto, memoria):

    texto = texto.lower()

    palavras_followup = [
        "quais", "lista", "mostra", "ver", "exibir"
    ]

    if not any(p in texto for p in palavras_followup):
        return None

    ultima = memoria.get("ultima_intencao")

    if ultima == "livros_qtd":
        return "livros_lista"

    if ultima == "categorias_qtd":
        return "categorias_lista"

    if ultima == "reservas_qtd":
        return "reservas_lista"

    if ultima == "emprestimos_qtd":
        return "emprestimos_lista"

    return ultima