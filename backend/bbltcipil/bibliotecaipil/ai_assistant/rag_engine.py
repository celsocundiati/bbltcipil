import os
import threading
import numpy as np

from livros.models import Livro
from sentence_transformers import SentenceTransformer

# =========================
# ⚙️ CONFIG
# =========================
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

# =========================
# 🔒 GLOBAL STATE
# =========================
model = None

DOCS_CACHE = None
EMBEDDINGS_CACHE = None

model_lock = threading.Lock()
embedding_lock = threading.Lock()
cache_lock = threading.Lock()


# =========================
# 🚀 MODELO
# =========================
def carregar_modelo():
    global model

    if model is None:
        with model_lock:
            if model is None:
                try:
                    print("📥 Carregando modelo...")
                    model = SentenceTransformer(MODEL_NAME)
                    print("✅ Modelo carregado com sucesso")
                except Exception as e:
                    print("❌ Erro ao carregar modelo:", e)
                    model = None

    return model


# =========================
# 📚 INDEXAÇÃO
# =========================
def indexar_livros():
    try:
        print("📚 Indexando livros...")

        livros = Livro.objects.select_related("categoria", "autor").all()

        docs = []

        for l in livros:
            texto = f"{l.titulo} {l.categoria.nome if l.categoria else ''} {l.autor.nome if l.autor else ''}"

            docs.append({
                "id": l.id,
                "texto": texto,
                "livro": l
            })

        print(f"✅ {len(docs)} livros indexados")
        return docs

    except Exception as e:
        print("❌ Erro ao indexar livros:", e)
        return []


# =========================
# 🔢 EMBEDDINGS
# =========================
def gerar_embeddings(docs):
    modelo = carregar_modelo()

    if not modelo or not docs:
        return None

    textos = [d["texto"] for d in docs]

    try:
        with embedding_lock:
            print("🔢 Gerando embeddings...")

            embeddings = modelo.encode(
                textos,
                convert_to_numpy=True,
                normalize_embeddings=True
            )

            print("✅ Embeddings gerados")
            return embeddings

    except Exception as e:
        print("❌ Erro embeddings:", e)
        return None


# =========================
# 💾 CACHE
# =========================
def carregar_base():
    global DOCS_CACHE, EMBEDDINGS_CACHE

    if not DOCS_CACHE or EMBEDDINGS_CACHE is None:
        with cache_lock:
            if not DOCS_CACHE or EMBEDDINGS_CACHE is None:
                print("📚 Criando base vetorial...")

                DOCS_CACHE = indexar_livros()
                EMBEDDINGS_CACHE = gerar_embeddings(DOCS_CACHE)

                print("✅ Base carregada em memória")

    return DOCS_CACHE, EMBEDDINGS_CACHE


# =========================
# ♻️ RESET CACHE
# =========================
def resetar_cache():
    global DOCS_CACHE, EMBEDDINGS_CACHE

    with cache_lock:
        DOCS_CACHE = None
        EMBEDDINGS_CACHE = None
        print("♻️ Cache resetado")


# =========================
# 🔎 BUSCA SEMÂNTICA
# =========================
def buscar_livros(pergunta, top_k=5):
    print(f"🔍 Pergunta: {pergunta}")

    modelo = carregar_modelo()

    if not modelo:
        return []

    docs, embeddings = carregar_base()

    if not embeddings or not docs:
        return []

    try:
        with embedding_lock:
            query_vec = modelo.encode(
                pergunta,
                convert_to_numpy=True,
                normalize_embeddings=True
            )

    except Exception as e:
        print("❌ Erro query embedding:", e)
        return []

    scores = np.dot(embeddings, query_vec)

    top_indices = np.argsort(scores)[::-1][:top_k]

    resultados = [
        docs[i] for i in top_indices if scores[i] > 0.25
    ]

    print(f"📊 Resultados: {len(resultados)}")

    return resultados


# =========================
# 🚀 PRELOAD SEGURO
# =========================
def preload():
    """
    NÃO toca no banco.
    Só carrega modelo.
    """
    print("🚀 Pré-carregando IA...")

    carregar_modelo()

    print("✅ IA pronta (modelo carregado)")