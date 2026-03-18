from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.apps import apps


User = get_user_model()

class AuditLog(models.Model):
    ACAO_CHOICES = [
        ("Sign up", "Sign up"),
        ("Adicionou", "Adicionou"),
        ("Criou", "Criou"),
        ("Atualizou", "Atualizou"),
        ("Removeu", "Removeu"),
        ("Cancelou", "Cancelou"),
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
        User, on_delete=models.CASCADE, related_name="multas"
    )
    emprestimo = models.ForeignKey(
        "livros.Emprestimo", on_delete=models.SET_NULL, null=True, blank=True, related_name="multas"
    )
    motivo = models.CharField(max_length=50, choices=MOTIVO_CHOICES)
    descricao = models.TextField(blank=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="Pendente")
    data_criacao = models.DateTimeField(default=timezone.now)
    data_pagamento = models.DateTimeField(null=True, blank=True)
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="multas_criadas")
    atualizado_em = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Preenche o usuario automaticamente com base no emprestimo
        if self.emprestimo:
            self.usuario = self.emprestimo.reserva.usuario
        super().save(*args, **kwargs)

    def marcar_como_pago(self):
        if self.estado == "Pago":
            return
        self.estado = "Pago"
        self.data_pagamento = timezone.now()
        self.save()

    def dispensar(self):
        if self.estado == "Pago":
            raise ValueError("Não é possível dispensar uma multa já paga.")
        self.estado = "Dispensado"
        self.save()

    def __str__(self):
        return f"{self.usuario} - {self.valor} Kz ({self.estado})"
    


