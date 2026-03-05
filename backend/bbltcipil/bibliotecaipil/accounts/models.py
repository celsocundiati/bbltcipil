from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, RegexValidator
from django.utils import timezone
from django.apps import apps
from rest_framework.exceptions import ValidationError as DRFValidationError


class FuncionarioOficial(models.Model):
    n_agente = models.CharField(max_length=20, unique=True)
    n_bilhete = models.CharField(max_length=30)
    nome = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100, blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.nome} ({self.n_agente})"
    

class AlunoOficial(models.Model):
    n_processo = models.CharField(
        max_length=15,
        unique=True,
        validators=[MinLengthValidator(5)],
        help_text="Número de processo único do aluno"
    )
    
    nome_completo = models.CharField(max_length=100, help_text="Nome completo do aluno")
    
    n_bilhete = models.CharField(
        max_length=30,
        unique=True,
        validators=[MinLengthValidator(5)],
        help_text="Número de bilhete do aluno"
    )
    
    curso = models.CharField(max_length=70, help_text="Curso do aluno")
    
    classe = models.CharField(
        max_length=2,
        choices=[('10', '10ª Classe'), ('11', '11ª Classe'), ('12', '12ª Classe'), ('13', '13ª Classe')],
        help_text="Classe do aluno"
    )
    
    data_nascimento = models.DateField(help_text="Data de nascimento do aluno")
    
    # Associação opcional com usuário
    user = models.OneToOneField(
        User,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        help_text="Usuário do Django associado à conta do aluno"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Aluno Oficial"
        verbose_name_plural = "Alunos Oficiais"
        ordering = ["nome_completo"]

    def __str__(self):
        return f"{self.nome_completo} ({self.n_processo})"

    @property
    def idade(self):
        hoje = timezone.now().date()
        idade = hoje.year - self.data_nascimento.year
        if (hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day):
            idade -= 1
        return idade


class Funcionario(models.Model):

    ESTADOS = [
        ("Ativo", "Ativo"),
        ("Suspenso", "Suspenso"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    funcionario_oficial = models.OneToOneField(
        FuncionarioOficial,
        on_delete=models.CASCADE,
        related_name="perfil"
    )

    telefone = models.CharField(max_length=20, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default="Ativo")
    n_reservas = models.IntegerField(default=0)
    n_emprestimos = models.IntegerField(default=0)

    def __str__(self):
        # Agora acessamos o n_processo direto pelo aluno_oficial
        return f"{self.user.username} - {self.funcionario_oficial.nome}"
    

    def atualizar_contadores(self):
        Emprestimo = apps.get_model("livros", "Emprestimo")
        Reserva = apps.get_model("livros", "Reserva")

        self.n_reservas = Reserva.objects.filter(
            usuario=self.user,
            estado__in=["reservado", "pendente"]
        ).count()

        self.n_emprestimos = Emprestimo.objects.filter(
            reserva__usuario=self.user
        ).exclude(
            acoes="devolvido"
        ).count()

        self.save(update_fields=["n_reservas", "n_emprestimos"])

    def atualizar_estado(self):
        Emprestimo = apps.get_model("livros", "Emprestimo")

        atrasados = Emprestimo.objects.filter(
            reserva__usuario=self.user,
            acoes="atrasado"
        ).count()

        self.estado = "Suspenso" if atrasados > 3 else "Ativo"
        self.save(update_fields=["estado"])
        
