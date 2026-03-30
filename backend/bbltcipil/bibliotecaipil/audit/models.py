from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType


class AuditLog(models.Model):
    # 🔥 Constantes de ações
    ACAO_CRIAR = "Criou"
    ACAO_ATUALIZAR = "Atualizou"
    ACAO_REMOVER = "Removeu"
    ACAO_APROVAR = "Aprovou"
    ACAO_EXECUTAR = "Executou"

    ACAO_CHOICES = [
        (ACAO_CRIAR, "Criou"),
        (ACAO_ATUALIZAR, "Atualizou"),
        (ACAO_REMOVER, "Removeu"),
        (ACAO_APROVAR, "Aprovou"),
        (ACAO_EXECUTAR, "Executou"),
    ]

    # 🔥 Constantes de origem
    ORIGEM_MANUAL = "manual"
    ORIGEM_AUTOMATICO = "automatico"

    ORIGEM_CHOICES = [
        (ORIGEM_MANUAL, "Manual"),
        (ORIGEM_AUTOMATICO, "Automático"),
    ]

    # 🔹 Campos principais
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="audit_logs")
    acao = models.CharField(max_length=20, choices=ACAO_CHOICES)
    modelo = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    objeto_id = models.PositiveIntegerField()
    descricao = models.TextField(null=True, blank=True)
    alteracoes = models.JSONField(null=True, blank=True)
    origem = models.CharField(max_length=20, choices=ORIGEM_CHOICES, default=ORIGEM_MANUAL)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    trace_id = models.CharField(max_length=100, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]
        indexes = [
            models.Index(fields=["criado_em"]),
            models.Index(fields=["acao"]),
            models.Index(fields=["usuario"]),
            models.Index(fields=["modelo", "objeto_id"]),
        ]
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"

    def __str__(self):
        usuario_str = self.usuario.username if self.usuario else "SYSTEM"
        return f"[{self.origem.upper()}] {usuario_str} - {self.acao} ({self.modelo.app_label}.{self.modelo.model}) #{self.objeto_id}"

    # 🔹 Método helper para alterações
    def add_alteracao(self, campo, valor_antigo, valor_novo):
        """
        Adiciona uma alteração ao campo 'alteracoes' sem sobrescrever o restante.
        """
        if not self.alteracoes:
            self.alteracoes = {}
        self.alteracoes[campo] = {"antes": valor_antigo, "depois": valor_novo}
        self.save(update_fields=["alteracoes"])




        