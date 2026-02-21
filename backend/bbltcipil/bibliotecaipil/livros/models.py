from django.db import models, transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.apps import apps
from django.contrib.auth.models import User

class Categoria(models.Model):
    nome = models.CharField(max_length=60, unique=True)
    descricao = models.CharField(max_length=250, default="")
    n_livros = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nome


class Autor(models.Model):
    nome = models.CharField(max_length=120)
    nacionalidade = models.CharField(max_length=60)
    total_obras = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nome


class Livro(models.Model):
    ESTADOS = [
        ('Disponível', 'Disponível'),
        ('Indisponível', 'Indisponível'),
    ]

    titulo = models.CharField(max_length=120)
    isbn = models.CharField(max_length=13, unique=True)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name="livros")
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="livros")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponivel')
    publicado_em = models.DateField()
    descricao = models.TextField(blank=True, null=True)
    sumario = models.TextField()
    editora = models.CharField(max_length=45)
    n_paginas = models.PositiveIntegerField(default=1)
    quantidade = models.PositiveIntegerField(default=1)
    data = models.DateTimeField(auto_now_add=True)
    capa = models.URLField(max_length=500)

    def __str__(self):
        return self.titulo

    @property
    def estado_atual(self):
        # Sem estoque
        if self.quantidade <= 0:
            return 'Indisponível'

        # Empréstimos ativos ou atrasados
        if Emprestimo.objects.filter(reserva__livro=self, acoes__in=['ativo', 'atrasado']).exists():
            return 'Emprestado'

        # Reservas
        if self.reservas.filter(estado='reservado').exists():
            return 'Reservado'
        if self.reservas.filter(estado='pendente').exists():
            return 'Pendente'

        return 'Disponível'

    @property
    def informacao_atual(self):
        info_map = {
            'Disponível': "Este livro está disponível para reserva",
            'Reservado': "Este livro possui uma reserva pendente",
            'Emprestado': "Livro emprestado atualmente",
            'Pendente': "Aguardando disponibilidade",
            'Indisponível': "Livro indisponível no estoque",
        }
        return info_map.get(self.estado_atual, "")


class Aluno(models.Model):
    ESTADOS = [
        ('Ativo', 'Ativo'),
        ('Suspenso', 'Suspenso'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    n_processo = models.IntegerField(primary_key=True)
    curso = models.CharField(max_length=100, blank=True)
    classe = models.CharField(max_length=20, blank=True)
    data_nascimento = models.DateField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Ativo')
    n_reservas = models.IntegerField(default=0)
    n_emprestimos = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.n_processo}"

    def atualizar_contadores(self):
        Emprestimo = apps.get_model('livros', 'Emprestimo')

        self.n_reservas = self.reservas.filter(estado__in=['reservado', 'pendente']).count()
        self.n_emprestimos = Emprestimo.objects.filter(reserva__aluno=self).exclude(acoes='devolvido').count()
        self.save(update_fields=['n_reservas', 'n_emprestimos'])

    def atualizar_estado(self):
        Emprestimo = apps.get_model('livros', 'Emprestimo')
        atrasados = Emprestimo.objects.filter(reserva__aluno=self, acoes='atrasado').count()
        self.estado = 'Suspenso' if atrasados > 3 else 'Ativo'
        self.save(update_fields=['estado'])


class Reserva(models.Model):
    ESTADOS = [
        ('pendente', 'Pendente'),
        ('reservado', 'Reservado'),
        ('aprovada', 'Aprovada'),
        ('finalizada', 'Finalizada'),
    ]

    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name="reservas")
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name="reservas")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendente')
    data_reserva = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.livro.titulo} reservado por {self.aluno.user.username} ({self.estado})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if is_new:
            if self.livro.quantidade <= 0:
                raise ValidationError(f"Livro '{self.livro.titulo}' indisponível no estoque.")
            if Reserva.objects.filter(aluno=self.aluno, livro=self.livro, estado__in=['pendente','reservado']).exists():
                raise ValidationError("Você já possui uma reserva ativa para este livro.")

        super().save(*args, **kwargs)
        self.aluno.atualizar_contadores()


    @property
    def capa(self):
        return self.livro.capa

    @property
    def informacao(self):
        info_map = {
            'pendente': "Aguardando aprovação ou disponibilidade",
            'reservado': "Pronta para empréstimo",
            'emprestado': "Livro emprestado atualmente",
            'finalizada': "Reserva concluída",
        }
        return info_map.get(self.estado, "")


class Emprestimo(models.Model):
    ACOES = [
        ('ativo', 'Ativo'),
        ('atrasado', 'Atrasado'),
        ('devolvido', 'Devolvido'),
    ]

    reserva = models.OneToOneField(Reserva, on_delete=models.CASCADE, related_name="emprestimo")
    acoes = models.CharField(max_length=20, choices=ACOES, default='ativo')
    data_emprestimo = models.DateField(auto_now_add=True)
    data_devolucao = models.DateField()

    @property
    def livro(self):
        return self.reserva.livro

    @property
    def aluno(self):
        return self.reserva.aluno

    @property
    def capa(self):
        return self.reserva.livro.capa

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        with transaction.atomic():
            livro = self.reserva.livro

            if is_new:
                if self.reserva.estado != 'reservado':
                    raise ValidationError("Empréstimo só pode ser criado a partir de reserva 'reservado'.")
                if livro.quantidade < 1:
                    raise ValidationError("Livro indisponível no estoque.")
                livro.quantidade -= 1
                livro.save(update_fields=['quantidade'])
                self.reserva.estado = 'aprovada'
                self.reserva.save(update_fields=['estado'])

            # Atualiza status atrasado automaticamente
            if self.acoes == 'ativo' and self.data_devolucao < timezone.now().date():
                self.acoes = 'atrasado'

            super().save(*args, **kwargs)

            # Devolução: devolve estoque e finaliza reserva
            if not is_new and self.acoes == 'devolvido':
                livro.quantidade += 1
                livro.save(update_fields=['quantidade'])
                self.reserva.estado = 'finalizada'
                self.reserva.save(update_fields=['estado'])

            # Atualiza contadores e estado do aluno
            self.aluno.atualizar_contadores()
            self.aluno.atualizar_estado()

    def __str__(self):
        return f"{self.livro.titulo} — {self.aluno.user.username} ({self.acoes})"


class Notificacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    criada_em = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(default="Geral")
    lida = models.BooleanField(default=False)  # <--- campo chave

    def __str__(self):
        return f"{self.usuario.username} - {self.titulo}"