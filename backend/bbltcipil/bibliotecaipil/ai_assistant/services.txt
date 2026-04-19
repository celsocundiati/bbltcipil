import re
import unicodedata
import os

from django.utils import timezone
from rapidfuzz import process

from administracao.models import ConfiguracaoSistema
from accounts.models import Perfil
from livros.models import Reserva, Livro, Emprestimo, Categoria, Autor

from django.db.models import Count

from .memory import obter_memoria_inteligente, resolver_followup
from .nlp_model import prever, normalizar, reduzir_repeticoes
from .rag_engine import buscar_livros


# =========================
# ✂️ DIVISÃO INTELIGENTE DE PERGUNTAS
# =========================
def dividir_perguntas(texto):
    separadores = r'[?.,;]| e | também | alem disso | depois |\n'
    partes = re.split(separadores, texto)

    perguntas = [
        p.strip() for p in partes
        if p.strip() and len(p.strip()) > 2
    ]

    return perguntas


# =========================
# 🔍 MATCH INTELIGENTE
# =========================
def extrair_categoria(texto):
    categorias = list(Categoria.objects.values_list("nome", flat=True))
    match = process.extractOne(texto, categorias)
    return match[0] if match and match[1] > 70 else None


def extrair_autor(texto):
    autores = list(Autor.objects.values_list("nome", flat=True))
    match = process.extractOne(texto, autores)
    return match[0] if match and match[1] > 70 else None


# =========================
# 📚 LISTAGENS
# =========================
def livros_por_categoria_geral():
    return "\n".join(
        f"\n📂 {c.nome}:\n" +
        "\n".join(f"• {l.titulo}" for l in Livro.objects.filter(categoria=c))
        for c in Categoria.objects.all()
        if Livro.objects.filter(categoria=c).exists()
    ) or "Sem dados."


def livros_por_autor_geral():
    return "\n".join(
        f"\n👤 {a.nome}:\n" +
        "\n".join(f"• {l.titulo}" for l in Livro.objects.filter(autor=a))
        for a in Autor.objects.all()
        if Livro.objects.filter(autor=a).exists()
    ) or "Sem dados."


def livros_lista():
    return "\n".join(f"• {l.titulo}" for l in Livro.objects.all()) or "Sem livros."


# =========================
# 🔥 FILTROS DINÂMICOS
# =========================
def livros_por_categoria_nome(nome):
    livros = Livro.objects.filter(categoria__nome__icontains=nome)
    return "\n".join(f"• {l.titulo}" for l in livros) or "Nenhum livro encontrado."


def livros_por_autor_nome(nome):
    livros = Livro.objects.filter(autor__nome__icontains=nome)
    return "\n".join(f"• {l.titulo}" for l in livros) or "Nenhum livro encontrado."


# =========================
# 📊 ESTATÍSTICAS
# =========================
def livros_recentes(limit=4):
    livros = Livro.objects.order_by("-created_at")[:limit]
    return "\n".join(f"• {l.titulo}" for l in livros) or "Sem livros."


def livro_mais_recente():
    livro = Livro.objects.order_by("-created_at").first()
    return f"📚 O livro mais recente é: {livro.titulo}" if livro else "Sem livros."


def livros_populares(limit=4):
    livros = Livro.objects.annotate(total=Count("reservas")).order_by("-total")[:limit]
    return "\n".join(f"• {l.titulo}" for l in livros) or "Sem dados."


def livro_mais_popular():
    livro = Livro.objects.annotate(total=Count("reservas")).order_by("-total").first()
    return f"📚 O livro mais popular ou o mais popular é: {livro.titulo}" if livro else "Sem dados."


def livros_menos_populares(limit=4):
    livros = Livro.objects.annotate(total=Count("reservas")).order_by("total")[:limit]
    return "\n".join(f"• {l.titulo}" for l in livros) or "Sem dados."


def livro_menos_popular():
    livro = Livro.objects.annotate(total=Count("reservas")).order_by("total").first()
    return f"📚 O livro menos requisitado ou o menso popular é: {livro.titulo}" if livro else "Sem dados."


def categorias_lista():
    return "\n".join(f"• {c.nome}" for c in Categoria.objects.all()) or "Sem categorias."


def categoria_top():
    categoria = Categoria.objects.annotate(total=Count("livros")).order_by("-total").first()
    return f"📂 A categoria com mais livros é: {categoria.nome}" if categoria else "Sem dados."


def categorias_recentes(limit=4):
    categoria = Categoria.objects.order_by("-created_at")[:limit]
    return "\n".join(f"• {c.nome}" for c in categoria) or "Sem categorias."


def categorias_poucos_livros(limit=4):
    categorias = Categoria.objects.annotate(total=Count("livros")).order_by("total")[:limit]
    return "\n".join(f"• {c.nome}" for c in categorias) or "Sem dados."


def categoria_livro_mais_recente():
    livro = Livro.objects.order_by("-created_at").first()
    return f"📂 A categoria com o livro mais recente é: {livro.categoria.nome}" if livro else "Sem livros."


def categorias_populares(limit=4):
    livros = Livro.objects.annotate(total=Count("reservas")).order_by("-total")[:limit]
    return "\n".join(f"• {l.categoria.nome}" for l in livros) or "Sem dados."


def categoria_mais_popular():
    livro = Livro.objects.annotate(total=Count("reservas")).order_by("-total").first()
    return f"📂 A categoria mais popular ou a mais requisitada é: {livro.categoria.nome}" if livro else "Sem dados."


def autores_lista():
    return "\n".join(f"• {a.nome}" for a in Autor.objects.all()) or "Sem autores."


def autor_top():
    autor = Autor.objects.annotate(total=Count("livros")).order_by("-total").first()
    return f"👤 O autor com mais obras é: {autor.nome}" if autor else "Sem dados."


def autores_recentes(limit=4):
    autores = Autor.objects.order_by("-created_at")[:limit]
    return "\n".join(f"• {a.nome}" for a in autores) or "Sem autores."


def autores_poucos_livros(limit=4):
    autores = Autor.objects.annotate(total=Count("livros")).order_by("total")[:limit]
    return "\n".join(f"• {a.nome}" for a in autores) or "Sem dados."


def autor_livro_mais_recente():
    livro = Livro.objects.order_by("-created_at").first()
    return f"👤 O Autor com o livro mais recente é: {livro.autor.nome}" if livro else "Sem livros."


def autores_populares(limit=4):
    livros = Livro.objects.annotate(total=Count("reservas")).order_by("-total")[:limit]
    return "\n".join(f"• {l.autor.nome}" for l in livros) or "Sem dados."


def autor_mais_popular():
    livro = Livro.objects.annotate(total=Count("reservas")).order_by("-total").first()
    return f"👤 O Autor mais popular é: {livro.autor.nome}" if livro else "Sem dados."


# =========================
# 🧠 INTENÇÕES EXTRAS
# =========================
def e_consulta_direta(texto):
    padroes = [
        "lista livros", "listar livros", "todos os livros",
        "quais são os livros", "quais sao os livros",
        "mostra livros"
    ]
    return any(p in texto for p in padroes)


def e_pedido_rag_seguro(texto):
    gatilhos = ["livro sobre", "recomenda", "parecido com", "semelhante", "tema"]
    return any(p in texto for p in gatilhos)


# =========================
# 🧠 PRIORIDADE DE INTENÇÃO (NOVO)
# =========================
def prioridade_intencao(texto):
    if "quantos" in texto or "quantidade" in texto:
        return "quantidade"
    if any(p in texto for p in ["lista", "listar", "mostra", "quais"]):
        return "lista"
    return None


# =========================
# 🧠 PROCESSAMENTO PRINCIPAL
# =========================
def processar_pergunta_unica(texto, user, chat):
    memoria = obter_memoria_inteligente(chat)

    texto = normalizar(texto)
    texto = reduzir_repeticoes(texto)

    tipo = prioridade_intencao(texto)

    # 🔢 PRIORIDADE MÁXIMA → QUANTIDADE
    if tipo == "quantidade":
        if "livros" in texto:
            return [f"A biblioteca contém {Livro.objects.count()} livros 📚."]
        if "reservas" in texto:
            return [f"Tens {Reserva.objects.filter(usuario=user).count()} reservas 📚."]
        if "emprestimos" in texto:
            return [f"Tens {Emprestimo.objects.filter(reserva__usuario=user).count()} empréstimos 📚."]

    intencao = prever(texto)

    followup = resolver_followup(texto, memoria)
    if followup:
        intencao = followup

    print("🎯 Intenção:", intencao)

    # =========================
    # 📚 CONSULTA DIRETA (AGORA SEGURA)
    # =========================
    if e_consulta_direta(texto) and tipo != "quantidade":
        return [f"📚 Os livros da biblioteca são:\n{livros_lista()}"]

    # =========================
    # 🧠 INTENÇÕES MANUAIS
    # =========================
    if any(p in texto for p in ["horario", "horário", "funciona", "abre", "fecha"]):
        config = ConfiguracaoSistema.objects.first()
        if config and config.horario_funcionamento:
            return [f"⏰ Horário da biblioteca:\n{config.horario_funcionamento}"]
        return ["⏰ A biblioteca funciona das 08h às 17h."]

    if "livros por categoria" in texto:
        return [livros_por_categoria_geral()]

    if "livros por autor" in texto:
        return [livros_por_autor_geral()]

    # =========================
    # 🔥 REGRA DIRETA AUTORES
    # =========================
    if "autor" in texto:
        if any(p in texto for p in ["quais", "lista", "listar", "mostra"]):
            return [f"Os autores são:\n{autores_lista()}"]

    # =========================
    # 🎯 INTENÇÕES NLP
    # =========================
    if intencao == "saudacao":
        return ["Estou bem sim obrigado 😊 \n Como posso te ajudar?"]

    if intencao == "saudacao_time":
        hora = timezone.now().hour
        if hora < 12:
            return ["Bom dia 👋 Como posso te ajudar?"]
        elif hora < 18:
            return ["Boa tarde 👋 Como posso te ajudar?"]
        return ["Boa noite 👋 Como posso te ajudar?"]

    if intencao == "saudacao_breve":
        return ["Olá 👋 Como posso te ajudar?"]

    if intencao == "livros_lista":
        return [f"Os livros 📚 da biblioteca são:\n{livros_lista()}"]

    if intencao == "livros_qtd":
        return [f"A biblioteca contém {Livro.objects.count()} livros 📚."]

    if intencao == "livro_popular":
        return [livro_mais_popular()]

    if intencao == "livros_populares":
        return [f"🔥 Os livros mais populares ou os mais requisitados são:\n{livros_populares()}"]

    if intencao == "livros_menos_populares":
        return [f"📉 Os livros menos populares ou os menos requisitados são:\n{livros_menos_populares()}"]

    if intencao == "livro_menos_popular":
        return [livro_menos_popular()]

    if intencao == "livros_recentes":
        return [f"📚 livros mais recentes:\n{livros_recentes()}"]

    if intencao == "livro_recente":
        return [livro_mais_recente()]

    if intencao == "categoria_top":
        return [categoria_top()]

    if intencao == "categorias_recentes":
        return [f"📂 As Categorias recentes são:\n{categorias_recentes()}"]
    
    if intencao == "categorias_populares":
        return [f"📂 As Categorias populares ou as mais requisitadas são:\n{categorias_populares()}"]

    if intencao == "categorias_poucas":
        return [f"📂 Categorias com poucos livros:\n{categorias_poucos_livros()}"]

    if intencao == "categoria_livro_recente":
        return [categoria_livro_mais_recente()]

    if intencao == "categoria_mais_requisitada":
        return [categoria_mais_popular()]

    if intencao == "categorias_qtd":
        return [f"Existem {Categoria.objects.count()} categorias no acervo da biblioteca."]

    if intencao == "categorias_lista":
        return [f"As categorias existentes são:\n{categorias_lista()}"]

    if intencao == "autor_top":
        return [autor_top()]

    if intencao == "autores_recentes":
        return [f"👤 Os recentes autores são:\n{autores_recentes()}"]    
    
    if intencao == "autores_populares":
        return [f"👤 Os Autores populares ou os mais requisitados são:\n{autores_populares()}"]

    if intencao == "autores_poucos":
        return [f"👤 Autores com poucas obras:\n{autores_poucos_livros()}"]

    if intencao == "autor_livro_recente":
        return [autor_livro_mais_recente()]

    if intencao == "autor_mais_requisitado":
        return [autor_mais_popular()]

    if intencao == "autores_qtd":
        return [f"Existem {Autor.objects.count()} autores no acervo da biblioteca."]

    if intencao == "autores_lista":
        return [f"Os autores são:\n{autores_lista()}"]

    if intencao == "reservas_qtd":
        return [f"Tens {Reserva.objects.filter(usuario=user).count()} reservas 📚."]

    if intencao == "emprestimos_qtd":
        return [f"Tens {Emprestimo.objects.filter(reserva__usuario=user).count()} empréstimos 📚."]

    # =========================
    # 🔥 EXTRAÇÃO DINÂMICA
    # =========================
    categoria_detectada = extrair_categoria(texto)
    autor_detectado = extrair_autor(texto)

    if categoria_detectada:
        return [f"📂 Livros da categoria {categoria_detectada}:\n{livros_por_categoria_nome(categoria_detectada)}"]

    if autor_detectado:
        return [f"👤 Livros do autor {autor_detectado}:\n{livros_por_autor_nome(autor_detectado)}"]

    # =========================
    # 🔎 RAG CONTROLADO
    # =========================
    if e_pedido_rag_seguro(texto):
        resultados = buscar_livros(texto)

        if resultados:
            resposta = "📚 Encontrei estes livros relacionados:\n"
            resposta += "\n".join(f"• {r['livro'].titulo}" for r in resultados)
            return [resposta]

    # =========================
    # ❌ FALLBACK
    # =========================
    return ["🤔 Não entendi bem. Podes reformular a pergunta?"]


# =========================
# 🧠 MULTI-INTENÇÃO
# =========================
def processar(texto, user, chat):
    perguntas = dividir_perguntas(texto)

    respostas = []

    for p in perguntas:
        print("🧩 Pergunta:", p)
        resp = processar_pergunta_unica(p, user, chat)
        if resp:
            respostas.extend(resp)

    respostas = list(dict.fromkeys(respostas))

    return respostas if respostas else ["🤔 Não entendi bem."]


# =========================
# 🤖 RESPOSTA FINAL
# =========================
def gerar_resposta(pergunta, user, chat):
    perfil = Perfil.objects.filter(user=user).first()
    nome = perfil.nome.split()[0] if perfil and perfil.nome else user.username

    respostas = processar(pergunta, user, chat)

    return f"{nome} 😊\n" + "\n".join(respostas)


# celery -A bibliotecaipil worker --loglevel=info --pool=solo
# celery -A bibliotecaipil beat --loglevel=info

