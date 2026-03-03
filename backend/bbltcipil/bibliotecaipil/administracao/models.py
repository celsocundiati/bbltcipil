from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class AuditLog(models.Model):
    ACAO_CHOICES = [
        ("Cadastrou-Se", "Cadastrou-Se"),
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
    

