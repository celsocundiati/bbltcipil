from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, RegexValidator
from django.utils import timezone


User = get_user_model()

class AuditLog(models.Model):
    ACAO_CHOICES = [
        ("create", "Criou"),
        ("update", "Atualizou"),
        ("delete", "Removeu"),
        ("approve", "Aprovou"),
    ]

    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    acao = models.CharField(max_length=20, choices=ACAO_CHOICES)
    modelo = models.CharField(max_length=100)
    objeto_id = models.IntegerField()
    alteracoes = models.JSONField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]

    def __str__(self):
        return f"{self.usuario} - {self.acao} - {self.modelo}"
    


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
    
