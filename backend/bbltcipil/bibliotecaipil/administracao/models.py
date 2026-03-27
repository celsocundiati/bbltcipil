from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.apps import apps
from livros.models import Emprestimo


User = get_user_model()

class AuditLog(models.Model):
    ACAO_CHOICES = [
        ("Sign up", "Sign up"),
        ("Adicionou", "Adicionou"),
        ("Criou", "Criou"),
        ("Atualizou", "Atualizou"),
        ("Removeu", "Removeu"),
        ("Finalizou", "Finalizou"),
        ("Aprovou", "Aprovou"),
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
    valor = models.DecimalField(max_digits=10, decimal_places=2)

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
        if self.estado != "Pago":
            self.estado = "Pago"
            self.data_pagamento = timezone.now()
            self.save()

    def dispensar(self):
        if self.estado == "Pago":
            raise ValueError("Multa já paga não pode ser dispensada.")
        self.estado = "Dispensado"
        self.save()

    def __str__(self):
        return f"{self.usuario} - {self.motivo} - {self.valor} Kz"
    


class ConfiguracaoSistema(models.Model):
    # 📚 Regras de Empréstimos
    dias_emprestimo = models.PositiveIntegerField(default=14)
    limite_livros_estudante = models.PositiveIntegerField(default=3)

    # 💰 Multas
    multa_por_dia = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    multa_por_dano = models.DecimalField(max_digits=10, decimal_places=2, default=1500)
    multa_por_perda = models.DecimalField(max_digits=10, decimal_places=2, default=5000)

    # ⏰ Horário
    horario_semana_abertura = models.TimeField(default="08:00")
    horario_semana_fecho = models.TimeField(default="16:00")

    horario_fim_semana_abertura = models.TimeField(default="08:00")
    horario_fim_semana_fecho = models.TimeField(default="12:00")

    # 📞 Contactos
    email = models.EmailField(default="biblioteca@example.com")
    telefone = models.CharField(max_length=20, default="")

    # 🔒 Controle
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Configurações do Sistema"
    
    class Meta:
        permissions = [
            ("gerir_usuarios", "Pode gerir usuários"),
            ("ver_relatorios", "Pode ver relatórios"),
        ]



