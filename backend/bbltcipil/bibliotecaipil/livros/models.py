from django.db import models, transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from accounts.models import Perfil
from django.contrib.auth import get_user_model

User = get_user_model()


# -----------------------------
# CATEGORIA
# -----------------------------
class Categoria(models.Model):
    nome = models.CharField(max_length=60, unique=True)
    descricao = models.CharField(max_length=250, default="")
    n_livros = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nome


# -----------------------------
# AUTOR
# -----------------------------


class Autor(models.Model):
    nome = models.CharField(max_length=120)
    nacionalidade = models.CharField(max_length=60)
    total_obras = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nome


# -----------------------------
# LIVRO
# -----------------------------
class Livro(models.Model):
    ESTADOS = [
        ('Disponível', 'Disponível'),
        ('Indisponível', 'Indisponível'),
    ]
    titulo = models.CharField(max_length=120)
    isbn = models.CharField(max_length=13, unique=True)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name="livros")
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="livros")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponível')
    publicado_em = models.DateField()
    descricao = models.TextField(blank=True, null=True)
    sumario = models.TextField()
    editora = models.CharField(max_length=45)
    n_paginas = models.PositiveIntegerField(default=1)
    quantidade = models.PositiveIntegerField(default=1)
    data = models.DateTimeField(auto_now_add=True)
    capa = models.URLField(max_length=500)
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Data de criação do perfil"
    )

    def __str__(self):
        return self.titulo

    @property
    def estado_atual(self):
        # Sem estoque
        if self.quantidade <= 0:
            return 'Indisponível'

        # Empréstimos ativos ou atrasados
        if hasattr(self, 'reservas') and self.reservas.filter(emprestimo__acoes__in=['ativo', 'atrasado']).exists():
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


# -----------------------------
# RESERVA
# -----------------------------
class Reserva(models.Model):
    ESTADOS = [
        ('pendente', 'Pendente'),
        ('reservado', 'Reservado'),
        ('aprovada', 'Aprovada'),
        ('finalizada', 'Finalizada'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reservas")
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name="reservas")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendente')
    data_reserva = models.DateTimeField(auto_now_add=True)
    aprovada_por = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="reservas_aprovadas")

    class Meta:
        ordering = ['-data_reserva']
        constraints = [
            models.UniqueConstraint(
                fields=['usuario', 'livro'],
                condition=models.Q(estado__in=['pendente', 'reservado']),
                name='unique_active_reserva'
            )
        ]

    def __str__(self):
        return f"{self.livro.titulo} reservado por {self.usuario.username} ({self.estado})"

    @property
    def perfil_oficial(self):
        return Perfil.objects.filter(user=self.usuario).first()

    @property
    def capa(self):
        return self.livro.capa

    @property
    def informacao(self):
        info_map = {
            'pendente': "Aguardando aprovação ou disponibilidade",
            'reservado': "Pronta para empréstimo",
            'aprovada': "Reserva aprovada e pronta para retirada",
            'finalizada': "Reserva concluída",
        }
        return info_map.get(self.estado, "")

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if is_new:
            if self.livro.quantidade <= 0:
                raise ValidationError(f"Livro '{self.livro.titulo}' indisponível no estoque.")

            if Reserva.objects.filter(usuario=self.usuario, livro=self.livro, estado__in=['pendente', 'reservado']).exists():
                raise ValidationError("Você já possui uma reserva ativa para este livro.")

        super().save(*args, **kwargs)

        perfil = self.perfil_oficial
        if perfil:
            perfil.atualizar_contadores()
            perfil.atualizar_estado()


# -----------------------------
# EMPRÉSTIMO
# -----------------------------
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
    def usuario(self):
        return self.reserva.usuario

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

            if self.acoes == 'ativo' and self.data_devolucao < timezone.now().date():
                self.acoes = 'atrasado'

            super().save(*args, **kwargs)

            if not is_new and self.acoes == 'devolvido':
                livro.quantidade += 1
                livro.save(update_fields=['quantidade'])
                self.reserva.estado = 'finalizada'
                self.reserva.save(update_fields=['estado'])

            perfil = self.reserva.perfil_oficial
            if perfil:
                perfil.atualizar_contadores()
                perfil.atualizar_estado()

    def __str__(self):
        return f"{self.livro.titulo} — {self.usuario.username} ({self.acoes})"


# -----------------------------
# NOTIFICAÇÃO
# -----------------------------
class Notificacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    criada_em = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(default="Geral", max_length=50)
    lida = models.BooleanField(default=False)
    link = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.titulo}"
    

