from django.core.management.base import BaseCommand
from faker import Faker
from livros.models import Autor, Categoria, Livro
from livros.services.counters import rebuild_autor, rebuild_categoria
import random


class Command(BaseCommand):
    help = "Popula a base de dados com categorias, autores e livros"

    def handle(self, *args, **kwargs):
        fake = Faker('pt_PT')

        self.stdout.write(self.style.WARNING("A iniciar população da base de dados..."))

        # ======================
        # 1. CATEGORIAS (REALISTAS)
        # ======================
        categorias_nomes = [
            "Tecnologia", "Romance", "História", "Educação",
            "Ciência", "Negócios", "Autoajuda", "Filosofia",
            "Religião", "Arte", "Literatura Africana", "Biografia"
        ]

        categorias = []
        for nome in categorias_nomes:
            if not Categoria.objects.filter(nome=nome).exists():
                categorias.append(
                    Categoria(
                        nome=nome,
                        descricao=fake.sentence()
                    )
                )

        Categoria.objects.bulk_create(categorias)
        categorias_db = list(Categoria.objects.all())

        self.stdout.write(self.style.SUCCESS(f"{len(categorias)} categorias criadas."))

        # ======================
        # 2. AUTORES (MISTO REALISTA)
        # ======================
        autores_base = [
            ("Pepetela", "Angola"),
            ("José Eduardo Agualusa", "Angola"),
            ("Ondjaki", "Angola"),
            ("Chimamanda Ngozi Adichie", "Nigéria"),
            ("Machado de Assis", "Brasil"),
            ("George Orwell", "Reino Unido"),
        ]

        autores = []

        for nome, pais in autores_base:
            if not Autor.objects.filter(nome=nome).exists():
                autores.append(Autor(nome=nome, nacionalidade=pais))

        # completar até 30 com faker
        for _ in range(30 - len(autores)):
            autores.append(
                Autor(
                    nome=fake.name(),
                    nacionalidade=fake.country()
                )
            )

        Autor.objects.bulk_create(autores)
        autores_db = list(Autor.objects.all())

        self.stdout.write(self.style.SUCCESS(f"{len(autores)} autores criados."))

        # ======================
        # 3. LIVROS (COERENTES)
        # ======================
        livros = []

        for _ in range(50):

            categoria = random.choice(categorias_db)

            livros.append(
                Livro(
                    titulo=fake.catch_phrase(),
                    isbn=str(fake.unique.random_number(digits=13)),
                    autor=random.choice(autores_db),
                    categoria=categoria,
                    publicado_em=fake.date_between(start_date='-20y', end_date='today'),
                    descricao=fake.text(max_nb_chars=200),
                    sumario=fake.text(max_nb_chars=300),
                    editora=fake.company(),
                    n_paginas=random.randint(80, 600),
                    quantidade=random.randint(1, 15),
                    prateleira=random.randint(1, 15),
                    fila=random.randint(1, 7),
                    capa=f"https://picsum.photos/200/300?random={random.randint(1,1000)}"
                )
            )

        Livro.objects.bulk_create(livros)

        self.stdout.write(self.style.SUCCESS("50 livros criados com sucesso!"))
        self.stdout.write(self.style.SUCCESS("Base de dados populada com sucesso! 🚀"))


        # ======================
        # 4. REBUILD CONTADORES
        # ======================
        rebuild_categoria()
        rebuild_autor()

        self.stdout.write(self.style.SUCCESS("Contadores recalculados com sucesso!"))

        