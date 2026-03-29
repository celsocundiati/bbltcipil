from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType


class AuditLog(models.Model):

    ACAO_CHOICES = [
        ("Criou", "Criou"),
        ("Atualizou", "Atualizou"),
        ("Removeu", "Removeu"),
        ("Aprovou", "Aprovou"),
        ("Executou", "Executou"),
    ]

    ORIGEM_CHOICES = [
        ("manual", "Manual"),
        ("automatico", "Automático"),
    ]

    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    acao = models.CharField(max_length=20, choices=ACAO_CHOICES)

    modelo = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    objeto_id = models.IntegerField()

    descricao = models.TextField(null=True, blank=True)

    alteracoes = models.JSONField(null=True, blank=True)

    origem = models.CharField(max_length=20, choices=ORIGEM_CHOICES, default="manual")

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    trace_id = models.CharField(max_length=100, null=True, blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]

    def __str__(self):
        return f"[{self.origem}] {self.usuario or 'SYSTEM'} - {self.acao} ({self.modelo}) #{self.objeto_id}"