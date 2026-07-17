# import os
# import threading
# import numpy as np
# import torch
# from livros.models import Livro
# from sentence_transformers import SentenceTransformer

# # =========================
# # ⚙️ CONFIG
# # =========================
# MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# os.environ.setdefault(
#     "TOKENIZERS_PARALLELISM",
#     "false"
# )

# os.environ.setdefault(
#     "TRANSFORMERS_NO_ADVISORY_WARNINGS",
#     "true"
# )

# # os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
# # os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

# # =========================
# # 🔒 GLOBAL STATE
# # =========================
# model = None

# DOCS_CACHE = None
# EMBEDDINGS_CACHE = None

# model_lock = threading.Lock()
# embedding_lock = threading.Lock()
# cache_lock = threading.Lock()


# # =========================
# # 🚀 MODELO
# # =========================
# def carregar_modelo():
#     global model

#     if model is None:
#         with model_lock:
#             if model is None:
#                 try:
#                     print("📥 Carregando modelo...")
#                     model = SentenceTransformer(MODEL_NAME)
#                     print("✅ Modelo carregado com sucesso")
#                 except Exception as e:
#                     print("❌ Erro ao carregar modelo:", e)
#                     model = None

#     return model


# # =========================
# # 📚 INDEXAÇÃO
# # =========================
# def indexar_livros():
#     try:
#         print("📚 Indexando livros...")

#         livros = Livro.objects.select_related("categoria", "autor").all()

#         docs = []

#         for l in livros:
#             texto = f"{l.titulo} {l.categoria.nome if l.categoria else ''} {l.autor.nome if l.autor else ''}"

#             docs.append({
#                 "id": l.id,
#                 "texto": texto,
#                 "livro": l
#             })

#         print(f"✅ {len(docs)} livros indexados")
#         return docs

#     except Exception as e:
#         print("❌ Erro ao indexar livros:", e)
#         return []


# # =========================
# # 🔢 EMBEDDINGS
# # =========================
# def gerar_embeddings(docs):
#     modelo = carregar_modelo()

#     if modelo is None or not docs:
#         return None

#     textos = [d["texto"] for d in docs]

#     try:
#         # with embedding_lock:
#             # print("🔢 Gerando embeddings...")

#             # embeddings = modelo.encode(
#             #     textos,
#             #     batch_size=16,
#             #     convert_to_numpy=True,
#             #     normalize_embeddings=True
#             # )

#             # print("✅ Embeddings gerados")
#             # return embeddings

#         with embedding_lock:
#             print("🔢 Gerando embeddings...")

#             with torch.no_grad():
#                 embeddings = modelo.encode(
#                     textos,
#                     batch_size=16,
#                     convert_to_numpy=True,
#                     normalize_embeddings=True
#                 )

#             print("✅ Embeddings gerados")
#             return embeddings
        

#     except Exception as e:
#         print("❌ Erro embeddings:", e)
#         return None


# # =========================
# # 💾 CACHE
# # =========================
# def carregar_base():
#     global DOCS_CACHE, EMBEDDINGS_CACHE

#     if DOCS_CACHE is None or EMBEDDINGS_CACHE is None:

#         with cache_lock:

#             if DOCS_CACHE is None or EMBEDDINGS_CACHE is None:

#                 print("📚 Criando base vetorial...")

#                 DOCS_CACHE = indexar_livros()

#                 EMBEDDINGS_CACHE = gerar_embeddings(
#                     DOCS_CACHE
#                 )

#                 print("✅ Base carregada em memória")

#     return DOCS_CACHE, EMBEDDINGS_CACHE


# # =========================
# # ♻️ RESET CACHE
# # =========================
# def resetar_cache():
#     global DOCS_CACHE, EMBEDDINGS_CACHE

#     with cache_lock:
#         DOCS_CACHE = None
#         EMBEDDINGS_CACHE = None
#         print("♻️ Cache resetado")


# # =========================
# # 🔎 BUSCA SEMÂNTICA
# # =========================
# def buscar_livros(pergunta, top_k=5):
#     print(f"🔍 Pergunta: {pergunta}")

#     modelo = carregar_modelo()

#     if modelo is None:
#         return []

#     docs, embeddings = carregar_base()

#     # if not embeddings or not docs:
#     if embeddings is None or docs is None:
#         return []

#     try:
#         with embedding_lock:
#             query_vec = modelo.encode(
#                 pergunta,
#                 convert_to_numpy=True,
#                 normalize_embeddings=True
#             )

#     except Exception as e:
#         print("❌ Erro query embedding:", e)
#         return []

#     scores = np.dot(embeddings, query_vec)

#     top_indices = np.argsort(scores)[::-1][:top_k]

#     resultados = [
#         docs[i] for i in top_indices if scores[i] > 0.25
#     ]

#     print(f"📊 Resultados: {len(resultados)}")

#     return resultados


# # =========================
# # 🚀 PRELOAD SEGURO
# # =========================
# # def preload():
# #     """
# #     NÃO toca no banco.
# #     Só carrega modelo.
# #     """
# #     print("🚀 Pré-carregando IA...")

# #     carregar_modelo()

# #     print("✅ IA pronta (modelo carregado)")




import os
import threading
import numpy as np

from livros.models import Livro


# ==========================================================
# ⚙️ CONFIGURAÇÃO
# ==========================================================

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


os.environ.setdefault(
    "TOKENIZERS_PARALLELISM",
    "false"
)

os.environ.setdefault(
    "TRANSFORMERS_NO_ADVISORY_WARNINGS",
    "true"
)


# ==========================================================
# 🔒 ESTADO GLOBAL
# ==========================================================

model = None

DOCS_CACHE = None
EMBEDDINGS_CACHE = None


model_lock = threading.Lock()
embedding_lock = threading.Lock()
cache_lock = threading.Lock()



# ==========================================================
# 🚀 CARREGAR MODELO IA
# ==========================================================

def carregar_modelo():

    global model

    if model is None:

        with model_lock:

            if model is None:

                try:

                    from sentence_transformers import SentenceTransformer

                    print("📥 Carregando modelo IA...")

                    model = SentenceTransformer(
                        MODEL_NAME
                    )

                    print(
                        "✅ Modelo carregado com sucesso"
                    )


                except Exception as e:

                    print(
                        "❌ Erro ao carregar modelo:",
                        e
                    )

                    model = None


    return model



# ==========================================================
# 📚 INDEXAR LIVROS
# ==========================================================

def indexar_livros():

    try:

        print("📚 Indexando livros...")


        livros = Livro.objects.select_related(
            "categoria",
            "autor"
        ).all()


        docs = []


        for livro in livros:

            texto = (
                f"{livro.titulo} "
                f"{livro.categoria.nome if livro.categoria else ''} "
                f"{livro.autor.nome if livro.autor else ''}"
            )


            docs.append(
                {
                    "id": livro.id,
                    "texto": texto,
                    "livro": livro
                }
            )


        print(
            f"✅ {len(docs)} livros indexados"
        )


        return docs



    except Exception as e:

        print(
            "❌ Erro ao indexar livros:",
            e
        )

        return []



# ==========================================================
# 🔢 GERAR EMBEDDINGS
# ==========================================================

def gerar_embeddings(docs):

    modelo = carregar_modelo()


    if modelo is None or not docs:

        return None



    textos = [
        item["texto"]
        for item in docs
    ]


    try:

        with embedding_lock:


            print(
                "🔢 Gerando embeddings..."
            )


            embeddings = modelo.encode(
                textos,
                batch_size=16,
                convert_to_numpy=True,
                normalize_embeddings=True
            )


            print(
                "✅ Embeddings gerados"
            )


            return embeddings



    except Exception as e:

        print(
            "❌ Erro ao gerar embeddings:",
            e
        )


        return None




# ==========================================================
# 💾 CARREGAR BASE VETORIAL
# ==========================================================

def carregar_base():

    global DOCS_CACHE
    global EMBEDDINGS_CACHE



    if DOCS_CACHE is None or EMBEDDINGS_CACHE is None:


        with cache_lock:


            if DOCS_CACHE is None or EMBEDDINGS_CACHE is None:


                print(
                    "📚 Criando base vetorial..."
                )


                DOCS_CACHE = indexar_livros()


                EMBEDDINGS_CACHE = gerar_embeddings(
                    DOCS_CACHE
                )


                print(
                    "✅ Base carregada em memória"
                )



    return DOCS_CACHE, EMBEDDINGS_CACHE




# ==========================================================
# ♻️ RESET CACHE
# ==========================================================

def resetar_cache():

    global DOCS_CACHE
    global EMBEDDINGS_CACHE



    with cache_lock:

        DOCS_CACHE = None

        EMBEDDINGS_CACHE = None


        print(
            "♻️ Cache resetado"
        )





# ==========================================================
# 🔎 BUSCA SEMÂNTICA
# ==========================================================

def buscar_livros(
        pergunta,
        top_k=5
):


    print(
        f"🔍 Pergunta: {pergunta}"
    )


    modelo = carregar_modelo()



    if modelo is None:

        return []



    docs, embeddings = carregar_base()



    if docs is None or embeddings is None:

        return []



    try:


        with embedding_lock:


            query_vector = modelo.encode(

                pergunta,

                convert_to_numpy=True,

                normalize_embeddings=True,

                show_progress_bar=False

            )



    except Exception as e:


        print(
            "❌ Erro query embedding:",
            e
        )


        return []



    scores = np.dot(
        embeddings,
        query_vector
    )



    melhores = np.argsort(
        scores
    )[::-1][:top_k]



    resultados = [

        docs[i]

        for i in melhores

        if scores[i] > 0.25

    ]



    print(
        f"📊 Resultados encontrados: {len(resultados)}"
    )



    return resultados




# ==========================================================
# 🚀 PRELOAD SEGURO
# ==========================================================

# def preload():

#     """
#     Apenas carrega o modelo.
#     Não consulta banco.
#     Seguro para Celery/Gunicorn.
#     """


#     print(
#         "🚀 Pré-carregando IA..."
#     )


#     carregar_modelo()



#     print(
#         "✅ IA pronta"
#     )


# =========================
# 🚀 PRELOAD DESATIVADO
# =========================

def preload():
    """
    Desativado no ambiente web.
    O modelo será carregado apenas quando houver uma tarefa Celery.
    """
    print("⚠️ Preload ignorado.")
    return None

    