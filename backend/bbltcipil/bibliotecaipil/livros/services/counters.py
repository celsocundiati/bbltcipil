# # livros/services/counters.py

# from django.db.models import Count
# from livros.models import Categoria, Autor, Livro


# def rebuild_categoria(categoria_id):
#     total = Livro.objects.filter(categoria_id=categoria_id).count()

#     Categoria.objects.filter(pk=categoria_id).update(
#         n_livros=total
#     )


# def rebuild_autor(autor_id):
#     total = Livro.objects.filter(autor_id=autor_id).count()

#     Autor.objects.filter(pk=autor_id).update(
#         total_obras=total
#     )




from django.db.models import Count
from livros.models import Categoria, Autor, Livro


# =========================
# REBUILD GLOBAL (TODOS)
# =========================

def rebuild_categoria():
    categorias = (
        Livro.objects.values('categoria_id')
        .annotate(total=Count('id'))
    )

    # reset geral
    Categoria.objects.update(n_livros=0)

    for item in categorias:
        Categoria.objects.filter(pk=item['categoria_id']).update(
            n_livros=item['total']
        )


def rebuild_autor():
    autores = (
        Livro.objects.values('autor_id')
        .annotate(total=Count('id'))
    )

    # reset geral
    Autor.objects.update(total_obras=0)

    for item in autores:
        Autor.objects.filter(pk=item['autor_id']).update(
            total_obras=item['total']
        )


        