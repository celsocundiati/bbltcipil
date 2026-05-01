
from django.db.models import Count


# =========================
# REBUILD GLOBAL (TODOS)
# =========================

def rebuild_categoria(categoria_id):
    # exemplo de lógica
    from livros.models import Categoria, Livro

    categoria = Categoria.objects.get(id=categoria_id)
    total_livros = Livro.objects.filter(categoria=categoria).count()

    categoria.total_livros = total_livros
    categoria.save()


def rebuild_autor(autor_id):
    from livros.models import Autor, Livro

    total = Livro.objects.filter(autor_id=autor_id).count()

    Autor.objects.filter(pk=autor_id).update(
        total_obras=total
    )




    
        