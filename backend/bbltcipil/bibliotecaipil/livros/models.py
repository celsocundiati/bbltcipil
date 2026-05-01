from django.db import models, transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from accounts.models import Perfil
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

User = get_user_model()


# =============================
# CATEGORIA
# =============================
class Categoria(models.Model):
    nome = models.CharField(max_length=60, unique=True)
    descricao = models.CharField(max_length=250, default="")
    n_livros = models.PositiveIntegerField(default=0)

    def clean(self):
        if not self.nome or not self.nome.strip():
            raise ValidationError("Nome da categoria é obrigatório.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome


# =============================
# AUTOR
# =============================
class Autor(models.Model):
    nome = models.CharField(max_length=120)
    nacionalidade = models.CharField(max_length=60)
    total_obras = models.PositiveIntegerField(default=0)

    def clean(self):
        if not self.nome or not self.nome.strip():
            raise ValidationError("Nome do autor é obrigatório.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome


# =============================
# LIVRO
# =============================
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

    prateleira = models.PositiveIntegerField(null=True, blank=True)
    fila = models.PositiveIntegerField(blank=True, null=True)

    capa = models.URLField(max_length=500)

    data = models.DateTimeField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):

        if not self.titulo or not self.titulo.strip():
            raise ValidationError("Título é obrigatório.")

        if self.quantidade < 0:
            raise ValidationError("Quantidade não pode ser negativa.")

        if self.n_paginas <= 0:
            raise ValidationError("Número de páginas inválido.")

        if self.isbn and len(self.isbn) not in [10, 13]:
            raise ValidationError("ISBN inválido.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def estado_atual(self):

        if self.quantidade <= 0:
            return 'Indisponível'

        if self.reservas.filter(emprestimo__acoes__in=['ativo', 'atrasado']).exists():
            return 'Emprestado'

        if self.reservas.filter(estado='reservado').exists():
            return 'Reservado'

        if self.reservas.filter(estado='pendente').exists():
            return 'Pendente'

        if self.reservas.filter(estado='em_uso').exists():
            return 'Em uso'

        if self.reservas.filter(estado='expirada').exists():
            return 'Expirada'

        return 'Disponível'

    @property
    def informacao_atual(self):
        return {
            'Disponível': "Livro disponível para reserva",
            'Reservado': "Existe reserva ativa",
            'Em uso': "Sendo usado atualmente",
            'Emprestado': "Livro atualmente emprestado",
            'Pendente': "Aguardando aprovação",
            'Indisponível': "Sem stock disponível",
        }.get(self.estado_atual, "")

    def __str__(self):
        return self.titulo


# =============================
# RESERVA (CORE BUSINESS RULES)
# =============================
class Reserva(models.Model):

    ESTADOS = [
        ('pendente', 'Pendente'),
        ('reservado', 'Reservado'),
        ('em_uso', 'Em Uso'),
        ('finalizada', 'Finalizada'),
        ('expirada', 'Expirada'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reservas")
    livro = models.ForeignKey("Livro", on_delete=models.CASCADE, related_name="reservas")

    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendente', db_index=True)

    data_reserva = models.DateTimeField(auto_now_add=True)
    data_aprovacao = models.DateTimeField(null=True, blank=True, db_index=True)
    aprovada_por = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reservas_aprovadas"
    )

    class Meta:
        ordering = ['-data_reserva']

    # =========================
    # VALIDATION ONLY
    # =========================
    def clean(self):

        if not hasattr(self.usuario, "perfil"):
            raise ValidationError("Usuário sem perfil não pode reservar.")

        # duplicação ativa
        if Reserva.objects.filter(
            usuario=self.usuario,
            livro=self.livro,
            estado__in=["pendente", "reservado", "em_uso"]
        ).exclude(pk=self.pk).exists():
            raise ValidationError("Já existe reserva ativa.")

        # estoque lógico
        if self.estado == "reservado" and self.livro.quantidade <= 0:
            raise ValidationError("Sem estoque disponível.")

        if self.estado == "finalizada" and not self.aprovada_por:
            raise ValidationError("Aprovação requer administrador.")

        # transições seguras
        if self.pk:
            original = Reserva.objects.get(pk=self.pk)

            transicoes = {
                "pendente": ["reservado", "cancelada"],
                "reservado": ["em_uso", "cancelada", "expirada", "finalizada"],
                "em_uso": ["finalizada"],
                "finalizada": [],
                "expirada": [],
            }

            if self.estado != original.estado:
                if self.estado not in transicoes.get(original.estado, []):
                    raise ValidationError(
                        f"Transição inválida: {original.estado} → {self.estado}"
                    )

    # =========================
    # SAVE ONLY PERSISTENCE
    # =========================
    def save(self, *args, **kwargs):

        # regra automática só na criação
        if not self.pk:
            if self.livro.quantidade > 0:
                self.estado = "reservado"
                self.data_aprovacao = timezone.now()
            else:
                self.estado = "pendente"

        # consistência de aprovação
        if self.estado == "em_uso" and not self.data_aprovacao:
            self.data_aprovacao = timezone.now()

        self.full_clean()
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.livro.titulo} - {self.usuario.first_name} - {self.estado}"

    # 🔹 HELPERS
    @property
    def perfil_oficial(self):
        return Perfil.objects.filter(user=self.usuario).first()

    @property
    def capa(self):
        return self.livro.capa

    @property
    def informacao(self):
        info_map = {
            'pendente': "Aguardando disponibilidade",
            'reservado': "Confirmada para retirada",
            'em_uso': "Livro em utilização",
            'finalizada': "Processo concluído",
            'expirada': "Expirada automaticamente"
        }
        return info_map.get(self.estado, "")
    

# =============================
# EMPRESTIMO (TRANSACTION SAFE)
# =============================
class Emprestimo(models.Model):

    ACOES = [
        ('ativo', 'Ativo'),
        ('atrasado', 'Atrasado'),
        ('devolvido', 'Devolvido'),
    ]

    reserva = models.OneToOneField(Reserva, on_delete=models.CASCADE, related_name="emprestimo")

    acoes = models.CharField(max_length=20, choices=ACOES, default='ativo', db_index=True)

    data_emprestimo = models.DateField(auto_now_add=True)
    data_devolucao = models.DateField(db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['acoes', 'data_devolucao']),
        ]


    @property
    def livro(self):
        return self.reserva.livro

    @property
    def usuario(self):
        return self.reserva.usuario

    @property
    def capa(self):
        return self.reserva.livro.capa

    def __str__(self):
        return f"{self.livro.titulo} — {self.usuario.first_name} ({self.acoes})"


    def clean(self):
        
        # 🔥 validação só na criação do empréstimo
        if self.pk is None:
            if self.reserva.estado != "reservado":
                raise ValidationError("Reserva deve estar no estado 'reservado'.")

        if self.data_devolucao and self.data_devolucao < timezone.now().date():
            raise ValidationError("Data de devolução inválida.")

    def save(self, *args, **kwargs):

        is_new = self.pk is None

        self.full_clean()

        with transaction.atomic():

            if is_new:

                livro = Livro.objects.select_for_update().get(id=self.reserva.livro.id)

                if livro.quantidade <= 0:
                    raise ValidationError("Sem stock disponível.")

                livro.quantidade -= 1
                livro.save(update_fields=["quantidade"])

            super().save(*args, **kwargs)


# =============================
# NOTIFICAÇÃO
# =============================
class Notificacao(models.Model):

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)

    tipo = models.CharField(max_length=50, default="Geral")
    lida = models.BooleanField(default=False)

    link = models.CharField(max_length=255, blank=True, null=True)

    criada_em = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.titulo or not self.titulo.strip():
            raise ValidationError("Título obrigatório.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.usuario.first_name} - {self.titulo}"


# =============================
# BASE ABSTRACT (EVITA DUPLICAÇÃO)
# =============================
class BaseEvento(models.Model):

    ESTADOS = [
        ('Disponível', 'Disponível'),
        ('Reservado', 'Reservado'),
        ('Esgotado', 'Esgotado'),
        ('Encerrado', 'Encerrado'),
    ]

    titulo = models.CharField(max_length=255)
    capa = models.URLField(max_length=500)
    descricao = models.TextField(blank=True)
    local = models.CharField(max_length=255)

    capacidade_maxima = models.PositiveIntegerField()

    estado = models.CharField(
        max_length=15,
        choices=ESTADOS,
        default='Disponível'
    )

    # ✅ CORRETO: apenas data (dia/mês/ano)
    data_inicio = models.DateField()
    data_fim = models.DateField()

    class Meta:
        abstract = True

    # =========================
    # HELPERS
    # =========================
    def vagas_disponiveis(self):
        if not self.pk:
            return self.capacidade_maxima

        return self.capacidade_maxima - self.participacoes.count()

    def hoje(self):
        return timezone.now().date()

    # =========================
    # BUSINESS LOGIC
    # =========================
    def atualizar_estado(self):

        if self.data_fim < self.hoje():
            self.estado = 'Encerrado'

        elif self.pk and self.vagas_disponiveis() <= 0:
            self.estado = 'Esgotado'

        else:
            self.estado = 'Disponível'

    # =========================
    # VALIDATION
    # =========================
    def clean(self):

        if self.capacidade_maxima <= 0:
            raise ValidationError("Capacidade deve ser maior que zero.")

        if self.data_inicio >= self.data_fim:
            raise ValidationError("Data de início deve ser menor que a data de fim.")

    # =========================
    # SAVE (SEGURO E CORRIGIDO)
    # =========================
    def save(self, *args, **kwargs):

        # valida antes de salvar
        self.full_clean()

        # salva primeiro para garantir PK
        super().save(*args, **kwargs)

        # atualiza estado com segurança
        self.atualizar_estado()

        super().save(update_fields=["estado"])


# =============================
# EXPOSIÇÃO
# =============================
class Exposicao(BaseEvento):

    def __str__(self):
        return f"Exposição: {self.titulo}"


# =============================
# EVENTO
# =============================
class Evento(BaseEvento):

    def __str__(self):
        return f"Evento: {self.titulo}"


# =============================
# PARTICIPAÇÃO
# =============================
class Participacao(models.Model):

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    exposicao = models.ForeignKey(
        Exposicao,
        null=True,
        blank=True,
        related_name='participacoes',
        on_delete=models.CASCADE
    )

    evento = models.ForeignKey(
        Evento,
        null=True,
        blank=True,
        related_name='participacoes',
        on_delete=models.CASCADE
    )

    compareceu = models.BooleanField(default=False)
    data_registro = models.DateTimeField(auto_now_add=True)

    # =========================
    # VALIDATION
    # =========================
    def clean(self):

        if not self.exposicao and not self.evento:
            raise ValidationError("Deve escolher um evento ou uma exposição.")

        if self.exposicao and self.evento:
            raise ValidationError("Escolha apenas um: evento OU exposição.")

        alvo = self.exposicao or self.evento

        if alvo and alvo.estado == 'Encerrado':
            raise ValidationError("Evento/Exposição encerrado.")

        if alvo and alvo.vagas_disponiveis() <= 0:
            raise ValidationError("Sem vagas disponíveis.")

        if Participacao.objects.filter(
            usuario=self.usuario,
            exposicao=self.exposicao,
            evento=self.evento
        ).exclude(pk=self.pk).exists():
            raise ValidationError("Usuário já está inscrito.")

    # =========================
    # SAVE
    # =========================
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        alvo = self.exposicao or self.evento
        return f"{self.usuario} - {alvo.titulo if alvo else 'Sem alvo'}"








