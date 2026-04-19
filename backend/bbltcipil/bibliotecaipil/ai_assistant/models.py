from django.db import models
from django.contrib.auth.models import User


# =========================
# 💬 CHAT (SESSÃO)
# =========================
class Chat(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat {self.id} - {self.usuario.username}"


# =========================
# 📨 MENSAGENS
# =========================
class Mensagem(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="mensagens")
    tipo = models.CharField(max_length=10)  # "user" ou "ia"
    texto = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - {self.texto[:30]}"