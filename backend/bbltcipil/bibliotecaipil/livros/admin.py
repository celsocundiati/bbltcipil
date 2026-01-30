from django.contrib import admin
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno  # exemplo

admin.site.register(Livro)
admin.site.register(Autor)
admin.site.register(Categoria)
admin.site.register(Reserva)
admin.site.register(Emprestimo)
admin.site.register(Aluno)
