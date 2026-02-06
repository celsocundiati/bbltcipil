from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.dispatch import receiver
from django.utils import timezone


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
        ('disponivel', 'Disponível'),
        ('indisponivel', 'Indisponível'),
    ]

    titulo = models.CharField(max_length=120)
    isbn = models.CharField(max_length=13, unique=True)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name="livros")
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="livros")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='disponivel')
    publicado_em = models.DateField()
    descricao = models.TextField(
            blank=True,
            null=True,
            help_text="Descrição detalhada do livro"
        )
    sumario = models.TextField()
    editora = models.CharField(max_length=45)
    n_paginas = models.PositiveIntegerField(default=1)
    quantidade = models.PositiveIntegerField(default=1)
    data = models.DateTimeField(auto_now_add=True)
    capa = models.URLField(max_length=500)  # URL da Cloudinary

    def __str__(self):
        return f"{self.titulo}"

    # ✅ Propriedade dinâmica do estado
    @property
    def estado_atual(self):
        
        if self.quantidade == 0:
            return 'Indisponível'

        # Verifica se existe empréstimo ativo ou atrasado
        
        if self.emprestimos.filter(acoes__in=['ativo', 'atrasado']).exists():
            return 'Emprestado'

        # Verifica se existe reserva
        if self.reservas.filter(estado='reservado').exists():
            return 'Reservado'
        
        if self.reservas.filter(estado='pendente').exists():
            return 'Pendente'

        # Caso contrário, está disponível
        return 'Disponível'

    # ✅ Informação baseada no estado dinâmico
    @property
    def informacao_atual(self):
        info_map = {
            'Disponível': "Este livro está disponível para reserva",
            'Reservado': "Este livro possui uma reserva pendente",
            'Emprestado': "Livro emprestado atualmente",
            'Pendente': "Aguardando disponibilidade",
        }
        return info_map.get(self.estado_atual, "")


class Aluno(models.Model):
    ESTADOS = [
        ('Ativo', 'Ativo'),
        ('Suspenso', 'Suspenso'),
    ]
    nome = models.CharField(max_length=120)
    n_processo = models.IntegerField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # armazenar hash da senha
    curso = models.CharField(max_length=100, blank=True)
    classe = models.CharField(max_length=20, blank=True)  # ex: 12ºA
    data_nascimento = models.DateField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Ativo')
    n_reservas = models.IntegerField(default=0)
    n_emprestimos = models.IntegerField(default=0)

    def atualizar_contadores(self):
        # Contar reservas não finalizadas
        n_reservas_ativas = self.reservas.filter(
            estado__in=['reservado', 'pendente']
        ).count()
        self.n_reservas = n_reservas_ativas

        # Contar empréstimos não devolvidos
        n_emprestimos_ativos = self.emprestimos.exclude(
            acoes='devolvido'
        ).count()
        self.n_emprestimos = n_emprestimos_ativos

        self.save(update_fields=['n_reservas', 'n_emprestimos'])

    def __str__(self):
        return f"{self.nome} - {self.n_processo}"

    def save(self, *args, **kwargs):
        # hash da senha se ainda não estiver
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def verificar_senha(self, senha_digitada):
        return check_password(senha_digitada, self.password)

    def incrementar_reservas(self):
        self.n_reservas += 1
        self.save(update_fields=['n_reservas'])

    def incrementar_emprestimos(self):
        self.n_emprestimos += 1
        self.save(update_fields=['n_emprestimos'])


class Reserva(models.Model):
    ESTADOS = [
        ('reservado', 'Reservado'),
        ('pendente', 'Pendente'),
        ('emprestado', 'Emprestado'),
    ]

    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name="reservas")
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name="reservas")
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name="reservas")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendente')
    data_reserva = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.livro.titulo} reservado por {self.aluno.nome} ({self.estado})"

    def save(self, *args, **kwargs):
        # 1️⃣ Bloquear reserva se não houver quantidade
        if self.livro.quantidade <= 0:
            raise ValueError(f"Não é possível criar reserva: '{self.livro.titulo}' está indisponível no stock.")

        # 2️⃣ Evitar reserva duplicada pelo mesmo aluno para o mesmo livro
        if not self.pk:  # só checar se for nova reserva
            if Reserva.objects.filter(aluno=self.aluno, livro=self.livro, estado__in=['reservado', 'pendente']).exists():
                raise ValueError(f"Você já possui uma reserva para '{self.livro.titulo}'.")

        super().save(*args, **kwargs)

    # 3️⃣ Pegar capa direto do livro
    @property
    def capa(self):
        return self.livro.capa

    # 4️⃣ Informações baseadas no estado
    @property
    def informacao(self):
        info_map = {
            'reservado': "Pronta para empréstimo",
            'pendente': "Aguardando disponibilidade",
            'emprestado': "Livro emprestado atualmente",
        }
        return info_map.get(self.estado, "")


class Emprestimo(models.Model):
    ACOES = [
        ('ativo', 'Ativo'),
        ('atrasado', 'Atrasado'),
        ('devolvido', 'Devolvido'),
    ]

    reserva = models.OneToOneField(
        Reserva,
        on_delete=models.CASCADE,
        related_name="emprestimo"
    )
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name="emprestimos")
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name="emprestimos")
    acoes = models.CharField(max_length=20, choices=ACOES, default='ativo')
    data_emprestimo = models.DateField(auto_now_add=True)
    data_devolucao = models.DateField()

    @property
    def capa(self):
        # pega automaticamente do livro
        return self.livro.capa

    def save(self, *args, **kwargs):
        criando = self.pk is None

        # ❗ validação forte
        if criando and self.reserva.estado != 'reservado':
            raise ValueError(
                "Só é possível criar empréstimo a partir de uma reserva 'reservado'."
            )

        # herda dados da reserva
        self.aluno = self.reserva.aluno
        self.livro = self.reserva.livro
        self.autor = self.reserva.autor

        if self.livro and not self.capa:
            self.capa = self.livro.capa

        # atraso automático
        if (
            self.acoes == 'ativo'
            and self.data_devolucao
            and self.data_devolucao < timezone.now().date()
        ):
            self.acoes = 'atrasado'

        super().save(*args, **kwargs)

        # 🔥 atualiza estado da reserva APÓS criar empréstimo
        if criando:
            self.reserva.estado = 'emprestado'
            self.reserva.save(update_fields=['estado'])
        else:
            # se o empréstimo foi devolvido, libera a reserva
            if self.acoes == 'devolvido':
                self.reserva.estado = 'disponivel'  # ou o valor que representa "livre"
                self.reserva.save(update_fields=['estado'])

    def __str__(self):
        return f"{self.livro.titulo} — {self.aluno.nome} ({self.acoes})"

