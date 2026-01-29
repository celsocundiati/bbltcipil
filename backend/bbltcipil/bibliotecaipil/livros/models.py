from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.db.models.signals import post_save
from django.dispatch import receiver


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
        ('reservado', 'Reservado'),
        ('emprestado', 'Emprestado'),
        ('pendente', 'Pendente'),
    ]

    titulo = models.CharField(max_length=120)
    isbn = models.CharField(max_length=13, unique=True)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name="livros")
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="livros")
    publicado_em = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='disponivel')
    informacao = models.CharField(max_length=30, default="Reservar Livro")
    sumario = models.TextField()
    editora = models.CharField(max_length=45)
    n_paginas = models.PositiveIntegerField(default=1)
    quantidade = models.PositiveIntegerField(default=1)
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} ({self.get_estado_display()})"


class Aluno(models.Model):
    nome = models.CharField(max_length=120)
    n_processo = models.IntegerField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # armazenar hash da senha
    curso = models.CharField(max_length=100, blank=True)
    classe = models.CharField(max_length=20, blank=True)  # ex: 12ºA
    data_nascimento = models.DateField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True)
    n_reservas = models.IntegerField(default=0)
    n_emprestimos = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.nome} ({self.n_processo})"

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
        ('disponivel', 'Disponível'),
        ('reservado', 'Reservado'),
        ('emprestado', 'Emprestado'),
        ('pendente', 'Pendente'),
    ]

    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name="reservas")
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name="reservas")
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name="reservas")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendente')
    data_reserva = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.livro.titulo} reservado por {self.aluno.nome} ({self.estado})"


class Emprestimo(models.Model):
    reserva = models.OneToOneField(
        Reserva,
        on_delete=models.CASCADE,
        related_name="emprestimo"
    )
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name="emprestimos")
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name="emprestimos")
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name="emprestimos")
    estado = models.CharField(max_length=20, choices=Reserva.ESTADOS, default='emprestado')
    data_emprestimo = models.DateField(auto_now_add=True)
    data_devolucao = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Só permite criar empréstimo se a reserva estiver "reservado"
        if self.reserva.estado != 'reservado':
            raise ValueError(
                "Só é possível criar empréstimo a partir de uma reserva com estado 'reservado'."
            )

        # Preenche automaticamente aluno, livro e autor
        self.aluno = self.reserva.aluno
        self.livro = self.reserva.livro
        self.autor = self.reserva.autor

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.livro.titulo} emprestado por {self.aluno.nome} ({self.estado})"


# Signals para atualizar contadores automaticamente
@receiver(post_save, sender=Reserva)
def atualizar_contador_reservas(sender, instance, created, **kwargs):
    if created:
        instance.aluno.incrementar_reservas()


@receiver(post_save, sender=Emprestimo)
def atualizar_contador_emprestimos(sender, instance, created, **kwargs):
    if created:
        instance.aluno.incrementar_emprestimos()
