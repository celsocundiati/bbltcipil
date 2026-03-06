from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from django.utils import timezone
from django.apps import apps


class Perfil(models.Model):

    TIPOS = [
        ("aluno", "Aluno"),
        ("funcionario", "Funcionário"),
    ]

    ESTADOS = [
        ("Ativo", "Ativo"),
        ("Suspenso", "Suspenso"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        help_text="Usuário do sistema associado a este perfil"
    )

    tipo = models.CharField(
        max_length=20,
        choices=TIPOS,
        help_text="Tipo de perfil dentro do sistema"
    )

    telefone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Número de telefone do utilizador"
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default="Ativo",
        help_text="Estado atual do perfil na biblioteca"
    )

    n_reservas = models.IntegerField(
        default=0,
        help_text="Número de reservas ativas do utilizador"
    )

    n_emprestimos = models.IntegerField(
        default=0,
        help_text="Número de empréstimos ativos do utilizador"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Data de criação do perfil"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Data da última atualização do perfil"
    )

    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"

    def __str__(self):
        return f"{self.user.username} - {self.nome}"

    @property
    def nome(self):

        if hasattr(self, "aluno_oficial"):
            return self.aluno_oficial.nome_completo

        if hasattr(self, "funcionario_oficial"):
            return self.funcionario_oficial.nome

        return self.user.username
    
    
    def atualizar_contadores(self):
        """Atualiza n_reservas e n_emprestimos do perfil usando apps.get_model"""
        Reserva = apps.get_model('livros', 'Reserva')
        Emprestimo = apps.get_model('livros', 'Emprestimo')

        # Contar reservas ativas do usuário
        self.n_reservas = Reserva.objects.filter(
            usuario=self.user,
            estado__in=['pendente', 'reservado']
        ).count()

        # Contar empréstimos ativos do usuário
        self.n_emprestimos = Emprestimo.objects.filter(
            reserva__usuario=self.user,  # <- aqui a chave
            acoes__in=['ativo']
        ).count()

        self.save(update_fields=['n_reservas', 'n_emprestimos'])

    def atualizar_estado(self):
        Emprestimo = apps.get_model('livros', 'Emprestimo')

        # Contar quantos empréstimos atrasados existem para o usuário
        atrasados = Emprestimo.objects.filter(
            reserva__usuario=self.user,  # atravessa a FK da reserva
            acoes='atrasado'
        ).count()

        self.estado = 'Suspenso' if atrasados > 3 else 'Ativo'
        self.save(update_fields=['estado'])



class FuncionarioOficial(models.Model):

    perfil = models.OneToOneField(
        Perfil,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="funcionario_oficial",
        help_text="Perfil do sistema associado ao funcionário"
    )

    n_agente = models.CharField(
        max_length=20,
        unique=True,
        validators=[MinLengthValidator(3)],
        help_text="Número único de agente do funcionário"
    )

    n_bilhete = models.CharField(
        max_length=30,
        validators=[MinLengthValidator(5)],
        help_text="Número do bilhete de identidade do funcionário"
    )

    nome = models.CharField(
        max_length=100,
        help_text="Nome completo do funcionário"
    )

    cargo = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Cargo ou função desempenhada pelo funcionário"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Data de criação do registro"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Data da última atualização"
    )

    class Meta:
        verbose_name = "Funcionário Oficial"
        verbose_name_plural = "Funcionários Oficiais"
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} ({self.n_agente})"


class AlunoOficial(models.Model):

    perfil = models.OneToOneField(
        Perfil,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="aluno_oficial",
        help_text="Perfil do sistema associado ao aluno"
    )

    n_processo = models.CharField(
        max_length=15,
        unique=True,
        validators=[MinLengthValidator(5)],
        help_text="Número de processo único do aluno"
    )

    nome_completo = models.CharField(
        max_length=100,
        help_text="Nome completo do aluno"
    )

    n_bilhete = models.CharField(
        max_length=30,
        unique=True,
        validators=[MinLengthValidator(5)],
        help_text="Número de bilhete do aluno"
    )

    curso = models.CharField(
        max_length=70,
        help_text="Curso do aluno"
    )

    classe = models.CharField(
        max_length=2,
        choices=[
            ('10', '10ª Classe'),
            ('11', '11ª Classe'),
            ('12', '12ª Classe'),
            ('13', '13ª Classe')
        ],
        help_text="Classe do aluno"
    )

    data_nascimento = models.DateField(
        help_text="Data de nascimento do aluno"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Data de criação do registro"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Data da última atualização"
    )

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

        if (hoje.month, hoje.day) < (
            self.data_nascimento.month,
            self.data_nascimento.day
        ):
            idade -= 1

        return idade
    

    