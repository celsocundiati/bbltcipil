from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from livros.models import Emprestimo
from django.core.validators import MinValueValidator, RegexValidator
from django.core.exceptions import ValidationError
from decimal import Decimal
from datetime import time

User = get_user_model()


class Multa(models.Model):

    ESTADO_CHOICES = [
        ("Pendente", "Pendente"),
        ("Pago", "Pago"),
        ("Dispensado", "Dispensado"),
    ]

    MOTIVO_CHOICES = [
        ("Atraso", "Atraso na devolução"),
        ("Dano", "Dano no material"),
        ("Perda", "Perda do material"),
        ("Outro", "Outro"),
    ]

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="multas"
    )

    emprestimo = models.ForeignKey(
        Emprestimo,
        on_delete=models.CASCADE,
        related_name="multas"
    )

    motivo = models.CharField(max_length=50, choices=MOTIVO_CHOICES)
    valor = models.PositiveIntegerField()

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default="Pendente"
    )

    data_criacao = models.DateTimeField(auto_now_add=True)
    data_pagamento = models.DateTimeField(null=True, blank=True)

    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="multas_criadas"
    )

    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["emprestimo", "motivo"],
                name="unique_multa_por_emprestimo_motivo"
            )
        ]

    def save(self, *args, **kwargs):
        if self.emprestimo_id:
            self.usuario = self.emprestimo.reserva.usuario
        super().save(*args, **kwargs)


    def marcar_como_pago(self):
        from administracao.service import devolver_emprestimo

        if self.estado == "Pago":
            return

        self.estado = "Pago"
        self.data_pagamento = timezone.now()

        self.save(update_fields=["estado", "data_pagamento"])

        # 🔥 REGRA DE NEGÓCIO: pagamento da multa força devolução
        emprestimo = self.emprestimo

        if emprestimo and emprestimo.acoes != "devolvido":
            devolver_emprestimo(emprestimo)

    def dispensar(self):
        if self.estado == "Pago":
            raise ValueError("Multa já paga não pode ser dispensada.")
        self.estado = "Dispensado"
        self.save()

    def __str__(self):
        return f"{self.usuario} - {self.motivo} - {self.valor}"


class ConfiguracaoSistema(models.Model):

    # =========================
    # 📌 RESERVAS
    # =========================
    limite_reservas_ativas = models.PositiveIntegerField(default=5)
    limite_reservas_uso = models.PositiveIntegerField(default=3)
    limite_reservas_total = models.PositiveIntegerField(null=True, blank=True)
    limite_reservas_mensal = models.PositiveIntegerField(default=10)

    # =========================
    # 📚 EMPRÉSTIMOS
    # =========================
    dias_emprestimo = models.PositiveIntegerField(default=14)
    limite_livros_estudante = models.PositiveIntegerField(default=3)

    # =========================
    # 💰 MULTAS (TOTALMENTE SEGURAS)
    # =========================
    cobranca_ativa = models.BooleanField(default=True)

    multa_por_dia = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        default=1,
        validators=[MinValueValidator(Decimal("0"))]
    )

    multa_por_perda_ou_dano = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        default=5,
        validators=[MinValueValidator(Decimal("0"))]
    )

    dias_tolerancia = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        default=5,
        validators=[MinValueValidator(Decimal("0"))]
    )

    # =========================
    # ⏰ HORÁRIOS
    # =========================
    horario_semana_abertura = models.TimeField(default=time(8, 0))
    horario_semana_fecho = models.TimeField(default=time(16, 0))

    horario_fim_semana_abertura = models.TimeField(default=time(8, 0))
    horario_fim_semana_fecho = models.TimeField(default=time(12, 0))

    # =========================
    # 📞 CONTACTOS
    # =========================
    email = models.EmailField(blank=True, null=True)

    telefone = models.CharField(
        max_length=20,
        blank=True,
        validators=[
            RegexValidator(
                regex=r"^\+?[0-9]{7,15}$",
                message="Número de telefone inválido."
            )
        ]
    )

    # =========================
    # 🔒 CONTROLO
    # =========================
    atualizado_em = models.DateTimeField(auto_now=True)

    # =========================
    # 🧠 VALIDAÇÃO GLOBAL (REGRA DE NEGÓCIO)
    # =========================
    def clean(self):
        errors = {}

        # ⏰ horários semana
        if self.horario_semana_abertura >= self.horario_semana_fecho:
            errors["horario_semana"] = "Abertura deve ser antes do fecho (semana)."

        # ⏰ horários fim de semana
        if self.horario_fim_semana_abertura >= self.horario_fim_semana_fecho:
            errors["horario_fim_semana"] = "Abertura deve ser antes do fecho (fim de semana)."

        # 💰 segurança extra contra negativos (backup da validação)
        for field in ["multa_por_dia", "multa_por_dano", "multa_por_perda"]:
            value = getattr(self, field)
            if value is not None and value < 0:
                errors[field] = "Valores de multa não podem ser negativos."

        if errors:
            raise ValidationError(errors)

    # =========================
    # 🔒 SINGLETON (1 CONFIG SÓ)
    # =========================
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    # =========================
    # 📌 DISPLAY
    # =========================
    def __str__(self):
        return "Configurações do Sistema"

    class Meta:
        verbose_name = "Configuração do Sistema"
        verbose_name_plural = "Configuração do Sistema"

        permissions = [
            ("gerir_usuarios", "Pode gerir usuários"),
            ("ver_relatorios", "Pode ver relatórios"),
        ]
